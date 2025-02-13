// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunction, LoaderFunctionArgs, MetaFunction, redirect, useActionData, useLoaderData } from "react-router";
import { useNavigate } from "react-router";
import RoleForm from "~/components/core/roles/RoleForm";
import SlideOverFormLayout from "~/components/ui/slideOvers/SlideOverFormLayout";
import { getTranslations } from "~/locale/i18next.server";
import { useAdminData } from "~/utils/data/useAdminData";
import { createAdminLog } from "~/utils/db/logs.db.server";
import { getAllPermissions, PermissionWithRoles } from "~/utils/db/permissions/permissions.db.server";
import { setRolePermissions } from "~/utils/db/permissions/rolePermissions.db.server";
import { deleteRole, getRole, RoleWithPermissions, updateRole } from "~/utils/db/permissions/roles.db.server";
import { getUserHasPermission } from "~/utils/helpers/PermissionsHelper";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import { useEffect } from "react";
import toast from "react-hot-toast";

type LoaderData = {
  title: string;
  item: RoleWithPermissions;
  permissions: PermissionWithRoles[];
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.roles.update");
  const { t } = await getTranslations(request);

  const item = await getRole(params.id ?? "");
  if (!item) {
    throw redirect("/admin/accounts/roles-and-permissions/roles");
  }
  const permissions = await getAllPermissions();
  const data: LoaderData = {
    title: `${item.name} | ${t("models.role.object")} | ${process.env.APP_NAME}`,
    item,
    permissions,
  };
  return data;
};

type ActionData = {
  success?: string;
  error?: string;
};
const badRequest = (data: ActionData) => Response.json(data, { status: 400 });
export const action: ActionFunction = async ({ request, params }) => {
  await verifyUserHasPermission(request, "admin.roles.update");
  const { t } = await getTranslations(request);

  const existing = await getRole(params.id ?? "");
  if (!existing) {
    return redirect("/admin/accounts/roles-and-permissions/roles");
  }

  const form = await request.formData();
  const action = form.get("action")?.toString() ?? "";
  if (action === "edit") {
    await verifyUserHasPermission(request, "admin.roles.update");
    const name = form.get("name")?.toString() ?? "";
    const description = form.get("description")?.toString() ?? "";
    const assignToNewUsers = Boolean(form.get("assign-to-new-users"));
    const type: "admin" | "app" = form.get("type")?.toString() === "admin" ? "admin" : "app";
    const permissions = form.getAll("permissions[]").map((f) => f.toString());
    const data = {
      name,
      description,
      assignToNewUsers,
      type,
    };
    try {
      await updateRole(existing.id, data);
      await setRolePermissions(existing.id, permissions);
      createAdminLog(
        request,
        "Updated",
        `${existing.name}: ${JSON.stringify({
          ...data,
          permissions,
        })}`
      );
      return Response.json({ success: t("shared.updated") });
    } catch (e: any) {
      return Response.json({ error: e.message }, { status: 400 });
    }
  } else if (action === "delete") {
    await verifyUserHasPermission(request, "admin.roles.delete");
    await deleteRole(existing.id);
    createAdminLog(request, "Deleted", `${existing.name}`);
  } else {
    return badRequest({ error: t("shared.invalidForm") });
  }
  return redirect("/admin/accounts/roles-and-permissions/roles");
};

export const meta: MetaFunction<typeof loader> = ({ data }) => [{ title: data?.title }];

export default function AdminEditRoleRoute() {
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const adminData = useAdminData();
  const navigate = useNavigate();

  useEffect(() => {
    if (actionData?.success) {
      toast.success(actionData.success);
    } else if (actionData?.error) {
      toast.error(actionData.error);
    }
  }, [actionData]);

  function goBack() {
    navigate("/admin/accounts/roles-and-permissions/roles");
  }
  return (
    <SlideOverFormLayout title={data.item.name} description={data.item.description} onClosed={goBack}>
      <RoleForm
        item={data.item}
        permissions={data.permissions}
        onCancel={goBack}
        canUpdate={getUserHasPermission(adminData, "admin.roles.update")}
        canDelete={getUserHasPermission(adminData, "admin.roles.delete")}
      />
    </SlideOverFormLayout>
  );
}
