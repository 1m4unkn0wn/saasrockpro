// @@@ pwned by 1m4unkn0wn @@@
import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { Outlet } from "react-router";
import { getTranslations } from "~/locale/i18next.server";
import RolesTable from "~/components/core/roles/RolesTable";
import { getAllRolesWithUsers, RoleWithPermissionsAndUsers } from "~/utils/db/permissions/roles.db.server";
import { useAdminData } from "~/utils/data/useAdminData";
import { FilterablePropertyDto } from "~/application/dtos/data/FilterablePropertyDto";
import { getFiltersFromCurrentUrl } from "~/utils/helpers/RowPaginationHelper";
import InputFilters from "~/components/ui/input/InputFilters";
import InputSearchWithURL from "~/components/ui/input/InputSearchWithURL";
import { getAllPermissionsIdsAndNames } from "~/utils/db/permissions/permissions.db.server";
import ButtonPrimary from "~/components/ui/buttons/ButtonPrimary";
import { createMetrics } from "~/modules/metrics/services/.server/MetricTracker";
import { serverTimingHeaders } from "~/modules/metrics/utils/defaultHeaders.server";
import { getUserHasPermission } from "~/utils/helpers/PermissionsHelper";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import { v2MetaFunction } from "~/utils/compat/v2MetaFunction";
export { serverTimingHeaders as headers };

export const meta: v2MetaFunction<LoaderData> = ({ data }) => [{ title: data?.title }];

type LoaderData = {
  title: string;
  items: RoleWithPermissionsAndUsers[];
  filterableProperties: FilterablePropertyDto[];
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.roles.view");
  const { time, getServerTimingHeader } = await createMetrics({ request, params }, "admin.roles-and-permissions.roles");
  let { t } = await getTranslations(request);

  const filterableProperties: FilterablePropertyDto[] = [
    { name: "name", title: "models.role.name" },
    { name: "description", title: "models.role.description" },
    {
      name: "permissionId",
      title: "models.permission.object",
      manual: true,
      options: (await time(getAllPermissionsIdsAndNames(), "getAllPermissionsIdsAndNames")).map((item) => {
        return {
          value: item.id,
          name: item.name,
        };
      }),
    },
  ];
  const filters = getFiltersFromCurrentUrl(request, filterableProperties);
  const items = await time(getAllRolesWithUsers(undefined, filters), "getAllRolesWithUsers");

  const data: LoaderData = {
    title: `${t("models.role.plural")} | ${process.env.APP_NAME}`,
    items,
    filterableProperties,
  };
  return Response.json(data, { headers: getServerTimingHeader() });
};

export default function AdminRolesRoute() {
  const data = useLoaderData<LoaderData>();
  const adminData = useAdminData();

  return (
    <div className="space-y-2">
      <div className="flex space-x-2">
        <div className="flex-grow">
          <InputSearchWithURL />
        </div>
        <InputFilters filters={data.filterableProperties} />
        <ButtonPrimary to="new">
          <div className="sm:text-sm">+</div>
        </ButtonPrimary>
      </div>
      {/* <InputSearchWithURL onNewRoute={getUserHasPermission(adminData, "admin.roles.create") ? "new" : undefined} /> */}
      <RolesTable items={data.items} canUpdate={getUserHasPermission(adminData, "admin.roles.update")} />
      <Outlet />
    </div>
  );
}
