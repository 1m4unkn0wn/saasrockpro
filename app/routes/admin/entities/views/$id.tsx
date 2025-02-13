// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunction, LoaderFunctionArgs, redirect, useLoaderData } from "react-router";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import EntityViewForm from "~/components/entities/views/EntityViewForm";
import { getTranslations } from "~/locale/i18next.server";
import { EntityViewsApi } from "~/utils/api/.server/EntityViewsApi";
import { useAppOrAdminData } from "~/utils/data/useAppOrAdminData";
import { EntityWithDetails, getEntityById } from "~/utils/db/entities/entities.db.server";
import { deleteEntityView, EntityViewWithTenantAndUser, getEntityViewWithTenantAndUser } from "~/utils/db/entities/entityViews.db.server";
import { TenantWithDetails, adminGetAllTenants } from "~/utils/db/tenants.db.server";
import { UserWithNames, adminGetAllUsersNames } from "~/utils/db/users.db.server";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";

type LoaderData = {
  item: EntityViewWithTenantAndUser;
  allTenants: TenantWithDetails[];
  allUsers: UserWithNames[];
};
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.entities.view");
  const item = await getEntityViewWithTenantAndUser(params.id ?? "");
  if (!item) {
    return redirect(`/admin/entities/views`);
  }

  const data: LoaderData = {
    item,
    allTenants: await adminGetAllTenants(),
    allUsers: await adminGetAllUsersNames(),
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

  const item = await getEntityViewWithTenantAndUser(params.id ?? "");
  if (!item) {
    return redirect(`/admin/entities/views`);
  }

  const form = await request.formData();
  const action = form.get("action")?.toString() ?? "";
  if (action === "edit") {
    try {
      const entityId = form.get("entityId")?.toString() ?? "";
      const entity = await getEntityById({ tenantId: null, id: entityId });
      if (!entity) {
        return Response.json({ error: "Entity not found" }, { status: 404 });
      }
      await EntityViewsApi.updateFromForm({ entity, item, form });
      return redirect(`/admin/entities/views`);
    } catch (e: any) {
      return badRequest({ error: e.message });
    }
  } else if (action === "delete") {
    try {
      await deleteEntityView(item.id);
      return redirect(`/admin/entities/views`);
    } catch (e: any) {
      return badRequest({ error: e.message });
    }
  } else {
    return badRequest({ error: t("shared.invalidForm") });
  }
};

export default function () {
  const data = useLoaderData<LoaderData>();
  const appOrAdminData = useAppOrAdminData();
  const navigate = useNavigate();

  const [entity, setEntity] = useState<EntityWithDetails>();
  const [type, setType] = useState<"default" | "tenant" | "user" | "system">();
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setEntity(appOrAdminData.entities.find((f) => f.id === data.item.entityId));
    setTenantId(data.item.tenantId ?? null);
    setUserId(data.item.userId ?? null);
    if (data.item.isSystem) {
      setType("system");
    } else if (!data.item.tenantId && !data.item.userId) {
      setType("default");
    } else if (data.item.tenantId && !data.item.userId) {
      setType("tenant");
    } else if (data.item.userId) {
      setType("user");
    }
  }, [appOrAdminData, data]);

  return (
    <div className="space-y-3">
      {entity && type && (
        <EntityViewForm
          entity={entity}
          tenantId={tenantId}
          userId={userId}
          isSystem={type === "system"}
          item={data.item}
          onClose={() => navigate(`/admin/entities/views`)}
          showViewType={true}
        />
      )}
    </div>
  );
}
