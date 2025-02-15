// @@@ pwned by 1m4unkn0wn @@@
import { EntityTemplate } from "@prisma/client";
import { ActionFunction, LoaderFunctionArgs, redirect, useLoaderData } from "react-router";
import { useNavigate, useParams } from "react-router";
import EntityTemplateForm from "~/components/entities/entityTemplates/EntityTemplateForm";
import SlideOverWideEmpty from "~/components/ui/slideOvers/SlideOverWideEmpty";
import { getTranslations } from "~/locale/i18next.server";
import UrlUtils from "~/utils/app/UrlUtils";
import { EntityWithDetails, getEntityBySlug } from "~/utils/db/entities/entities.db.server";
import { deleteEntityTemplate, getEntityTemplate, updateEntityTemplate } from "~/utils/db/entities/entityTemplates.db.server";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import { getTenantIdOrNull } from "~/utils/services/.server/urlService";

type LoaderData = {
  entity: EntityWithDetails;
  item: EntityTemplate;
};
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.entities.view");
  const tenantId = await getTenantIdOrNull({ request, params });
  const entity = await getEntityBySlug({ tenantId, slug: params.entity ?? "" });
  const item = await getEntityTemplate(params.id ?? "", { tenantId });
  if (!item) {
    return redirect(UrlUtils.getModulePath(params, `entities/${params.entity}/templates`));
  }
  const data: LoaderData = {
    entity,
    item,
  };
  return data;
};

type ActionData = {
  error?: string;
};
const badRequest = (data: ActionData) => Response.json(data, { status: 400 });
export const action: ActionFunction = async ({ request, params }) => {
  await verifyUserHasPermission(request, "admin.entities.update");
  const { t } = await getTranslations(request);
  const tenantId = await getTenantIdOrNull({ request, params });

  const existing = await getEntityTemplate(params.id ?? "", { tenantId });
  if (!existing) {
    return badRequest({ error: t("shared.notFound") });
  }

  const form = await request.formData();
  const action = form.get("action")?.toString() ?? "";
  const title = form.get("title")?.toString() ?? "";
  const config = form.get("config")?.toString() ?? "";

  if (action === "edit") {
    try {
      await updateEntityTemplate(params.id ?? "", {
        title,
        config,
      });
      return redirect(UrlUtils.getModulePath(params, `entities/${params.entity}/templates`));
    } catch (e: any) {
      return badRequest({ error: e.message });
    }
  } else if (action === "delete") {
    await verifyUserHasPermission(request, "admin.entities.delete");
    await deleteEntityTemplate(existing.id);
    return redirect(UrlUtils.getModulePath(params, `entities/${params.entity}/templates`));
  }
  return badRequest({ error: t("shared.invalidForm") });
};

export default function EditEntityTemplateRoute() {
  const data = useLoaderData<LoaderData>();
  const params = useParams();
  const navigate = useNavigate();
  function close() {
    navigate(UrlUtils.getModulePath(params, `entities/${params.entity}/templates`));
  }
  return (
    <SlideOverWideEmpty title="Edit Entity Template" open={true} className="sm:max-w-lg" onClose={close}>
      <EntityTemplateForm entity={data.entity} item={data.item} />
    </SlideOverWideEmpty>
  );
}
