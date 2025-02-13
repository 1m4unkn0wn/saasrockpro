// @@@ pwned by 1m4unkn0wn @@@
import { EntityWebhook } from "@prisma/client";
import { ActionFunction, LoaderFunctionArgs, redirect } from "react-router";
import { useLoaderData, useNavigate, useParams } from "react-router";
import EntityWebhookForm from "~/components/entities/webhooks/EntityWebhookForm";
import OpenModal from "~/components/ui/modals/OpenModal";
import { getTranslations } from "~/locale/i18next.server";
import { getEntityBySlug } from "~/utils/db/entities/entities.db.server";
import { getEntityWebhook, updateEntityWebhook, deleteEntityWebhook } from "~/utils/db/entities/entityWebhooks.db.server";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";

type LoaderData = {
  entityId: string;
  item: EntityWebhook;
};
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.entities.view");
  const entity = await getEntityBySlug({ tenantId: null, slug: params.entity! });
  if (!entity) {
    return redirect("/admin/entities");
  }
  const item = await getEntityWebhook(params.id ?? "");
  if (!item) {
    return redirect(`/admin/entities/${params.entity}/webhooks`);
  }
  const data: LoaderData = {
    entityId: entity.id,
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

  const entity = await getEntityBySlug({ tenantId: null, slug: params.entity! });
  if (!entity) {
    return redirect("/admin/entities");
  }

  const existing = await getEntityWebhook(params.id ?? "");
  if (!existing) {
    return badRequest({ error: t("shared.notFound") });
  }

  const form = await request.formData();
  const action = form.get("action")?.toString() ?? "";
  const webhookAction = form.get("webhook-action")?.toString() ?? "";
  const method = form.get("webhook-method")?.toString() ?? "";
  const endpoint = form.get("webhook-endpoint")?.toString() ?? "";

  if (action === "edit") {
    try {
      await updateEntityWebhook(params.id ?? "", {
        action: webhookAction,
        method,
        endpoint,
      });
      return redirect(`/admin/entities/${params.entity}/webhooks`);
    } catch (e: any) {
      return badRequest({ error: e.message });
    }
  } else if (action === "delete") {
    await verifyUserHasPermission(request, "admin.entities.delete");
    await deleteEntityWebhook(existing.id);
    return redirect(`/admin/entities/${params.entity}/webhooks`);
  }
  return badRequest({ error: t("shared.invalidForm") });
};

export default function EditEntityWebhookRoute() {
  const data = useLoaderData<LoaderData>();
  const params = useParams();
  const navigate = useNavigate();
  function close() {
    navigate(`/admin/entities/${params.entity}/webhooks`);
  }
  return (
    <OpenModal className="sm:max-w-sm" onClose={close}>
      <EntityWebhookForm item={data.item} />
    </OpenModal>
  );
}
