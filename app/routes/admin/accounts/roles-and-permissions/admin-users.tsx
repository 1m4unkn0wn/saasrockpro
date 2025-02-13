// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunction, LoaderFunctionArgs, MetaFunction, useLoaderData } from "react-router";
import { useSubmit } from "react-router";
import { getTranslations } from "~/locale/i18next.server";
import { getAllRoles, getRole, RoleWithPermissions } from "~/utils/db/permissions/roles.db.server";
import { adminGetAllUsers, getUser, UserWithDetails, UserWithRoles } from "~/utils/db/users.db.server";
import UserRolesTable from "~/components/core/roles/UserRolesTable";
import { useEffect, useState } from "react";
import InputSearch from "~/components/ui/input/InputSearch";
import { createUserRole, deleteUserRole } from "~/utils/db/permissions/userRoles.db.server";
import { createAdminLog } from "~/utils/db/logs.db.server";
import { useAdminData } from "~/utils/data/useAdminData";
import { getUserHasPermission } from "~/utils/helpers/PermissionsHelper";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";

type LoaderData = {
  title: string;
  items: UserWithDetails[];
  roles: RoleWithPermissions[];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.roles.update");
  const { t } = await getTranslations(request);

  const items = (await adminGetAllUsers()).items.filter((f) => f.admin);
  const roles = await getAllRoles("admin");

  const data: LoaderData = {
    title: `${t("models.role.adminRoles")} | ${process.env.APP_NAME}`,
    items,
    roles,
  };
  return data;
};

type ActionData = {
  error?: string;
};
const badRequest = (data: ActionData) => Response.json(data, { status: 400 });
export const action: ActionFunction = async ({ request, params }) => {
  await verifyUserHasPermission(request, "admin.roles.update");
  const { t } = await getTranslations(request);

  const form = await request.formData();
  const action = form.get("action")?.toString() ?? "";
  if (action === "edit") {
    const userId = form.get("user-id")?.toString() ?? "";
    const roleId = form.get("role-id")?.toString() ?? "";
    const add = form.get("add") === "true";

    const user = await getUser(userId);
    const role = await getRole(roleId);

    if (add) {
      await createUserRole(userId, roleId);
      createAdminLog(request, "Created", `${user?.email} - ${role?.name}}`);
    } else {
      await deleteUserRole(userId, roleId);
      createAdminLog(request, "Deleted", `${user?.email} - ${role?.name}}`);
    }
    return Response.json({});
  } else {
    return badRequest({ error: t("shared.invalidForm") });
  }
};

export const meta: MetaFunction<typeof loader> = ({ data }) => [{ title: data?.title }];

export default function AdminRolesAndPermissionsAdminUsersRoute() {
  const data = useLoaderData<LoaderData>();
  const adminData = useAdminData();
  const [items, setItems] = useState(data.items);
  const submit = useSubmit();

  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    setItems(data.items);
  }, [data]);

  const filteredItems = () => {
    if (!items) {
      return [];
    }
    return items.filter(
      (f) =>
        f.email?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.firstName?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.lastName?.toString().toUpperCase().includes(searchInput.toUpperCase()) ||
        f.tenants.find((f) => f.tenant.name.toUpperCase().includes(searchInput.toUpperCase())) ||
        f.roles.find(
          (f) => f.role.name.toUpperCase().includes(searchInput.toUpperCase()) || f.role.description.toUpperCase().includes(searchInput.toUpperCase())
        )
    );
  };

  function onChange(item: UserWithRoles, role: RoleWithPermissions, add: any) {
    const form = new FormData();
    form.set("action", "edit");
    form.set("user-id", item.id);
    form.set("role-id", role.id);
    form.set("add", add ? "true" : "false");
    submit(form, {
      method: "post",
    });
  }

  return (
    <div className="space-y-2">
      <InputSearch value={searchInput} setValue={setSearchInput} />
      <UserRolesTable items={filteredItems()} roles={data.roles} onChange={onChange} disabled={!getUserHasPermission(adminData, "admin.roles.set")} />
    </div>
  );
}
