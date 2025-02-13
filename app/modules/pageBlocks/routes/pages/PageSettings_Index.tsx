// @@@ pwned by 1m4unkn0wn @@@
import { LoaderFunctionArgs, redirect, ActionFunction } from "react-router";
import { getTranslations } from "~/locale/i18next.server";
import { deleteMetaTags } from "~/modules/pageBlocks/db/pageMetaTags.db.server";
import { deletePage, getPage, PageWithDetails, updatePage } from "~/modules/pageBlocks/db/pages.db.server";
import { PageConfiguration } from "../../dtos/PageConfiguration";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";

export namespace PageSettings_Index {
  export type LoaderData = {
    page: PageWithDetails;
  };
  export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    await verifyUserHasPermission(request, "admin.pages.view");
    const page = await getPage(params.id!);
    if (!page) {
      return redirect(params.tenant ? `/app/${params.tenant}/settings/pages` : "/admin/pages");
    }
    const data: LoaderData = {
      page,
    };
    return data;
  };

  export type ActionData = {
    success: string;
    error: string;
    page?: PageConfiguration;
  };
  export const action: ActionFunction = async ({ request, params }) => {
    await verifyUserHasPermission(request, "admin.pages.update");
    const { t } = await getTranslations(request);
    const form = await request.formData();
    const action = form.get("action")?.toString();

    const item = await getPage(params.id!);
    if (!item) {
      return redirect(params.tenant ? `/app/${params.tenant}/settings/pages` : "/admin/pages");
    }

    if (action === "update") {
      const isPublished = form.get("isPublished");
      const isPublic = form.get("isPublic");
      await updatePage(item, {
        isPublished: isPublished === "true" || isPublished === "on",
        isPublic: isPublic === "true" || isPublic === "on",
      });
      return Response.json({ success: "Page updated successfully" });
    } else if (action === "delete") {
      await verifyUserHasPermission(request, "admin.pages.delete");
      if (item.blocks.length > 0) {
        return Response.json({ error: "Page has custom blocks, please delete them first" }, { status: 400 });
      }
      if (item.metaTags.length > 0) {
        return Response.json({ error: "Page has meta tags, please delete them first" }, { status: 400 });
      }
      await deleteMetaTags(item);
      await deletePage(item.id);
      return redirect(params.tenant ? `/app/${params.tenant}/settings/pages` : "/admin/pages");
    } else {
      return Response.json({
        error: t("shared.invalidForm"),
      });
    }
  };
}
