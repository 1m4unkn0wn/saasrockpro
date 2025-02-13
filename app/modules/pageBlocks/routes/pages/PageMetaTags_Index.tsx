// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunction, LoaderFunctionArgs, redirect } from "react-router";
import { getTranslations } from "~/locale/i18next.server";
import { deleteMetaTags, getMetaTags } from "~/modules/pageBlocks/db/pageMetaTags.db.server";
import { getPage, PageWithDetails } from "~/modules/pageBlocks/db/pages.db.server";
import { setPageMetaTags } from "../../services/.server/pagesMetaTagsService";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";

export namespace PageMetaTags_Index {
  export type LoaderData = {
    title: string;
    page: PageWithDetails | null;
    metaTags: { name: string; content: string; order: number }[];
  };
  export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    await verifyUserHasPermission(request, "admin.pages.view");
    let page: PageWithDetails | null = null;
    if (params.id) {
      page = await getPage(params.id);
    } else if (params.tenant) {
      throw redirect(`/app/${params.tenant}/settings/pages`);
    }
    const metaTags = await getMetaTags(page?.id ?? null);
    const data: LoaderData = {
      title: `SEO | ${process.env.APP_NAME}`,
      metaTags: metaTags.map((tag, idx) => {
        return { name: tag.name, content: tag.value, order: tag.order ?? idx + 1 };
      }),
      page,
    };
    return data;
  };

  export type ActionData = {
    success: string;
    error: string;
    metaTags?: { name: string; content: string; order: number }[];
  };
  export const action: ActionFunction = async ({ request, params }) => {
    await verifyUserHasPermission(request, "admin.pages.update");
    const { t } = await getTranslations(request);
    const form = await request.formData();
    const action = form.get("action");
    let page: PageWithDetails | null = null;
    if (params.id) {
      page = await getPage(params.id);
    }

    if (action === "reset") {
      await deleteMetaTags(page);
      return Response.json({ success: "Meta tags reset successfully", metaTags: [] });
    } else if (action === "update") {
      const metaTags: { name: string; content: string; order: number }[] = form.getAll("metaTags[]").map((f: FormDataEntryValue) => {
        return JSON.parse(f.toString());
      });
      try {
        await setPageMetaTags(page?.id ?? null, metaTags);
        return Response.json({ success: "Meta tags updated successfully", metaTags });
        // return redirect(params.tenant ? `/app/${params.tenant}/settings/pages` : `/admin/pages`);
      } catch (e: any) {
        return Response.json({ error: e.message }, { status: 400 });
      }
    } else {
      return Response.json({ error: t("shared.invalidForm") }, { status: 400 });
    }
  };
}
