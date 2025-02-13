// @@@ pwned by 1m4unkn0wn @@@
import { LoaderFunctionArgs, MetaFunction, useLoaderData } from "react-router";
import { getTranslations } from "~/locale/i18next.server";
import { getAllPermissions, PermissionWithRoles } from "~/utils/db/permissions/permissions.db.server";
import PermissionsTable from "~/components/core/roles/PermissionsTable";
import { useAppData } from "~/utils/data/useAppData";
import { requireAuth } from "~/utils/loaders.middleware";

type LoaderData = {
  title: string;
  items: PermissionWithRoles[];
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await requireAuth({ request, params });
  const { t } = await getTranslations(request);

  const items = await getAllPermissions("app");

  const data: LoaderData = {
    title: `${t("models.permission.plural")} | ${process.env.APP_NAME}`,
    items,
  };
  return data;
};

export const meta: MetaFunction<typeof loader> = ({ data }) => [{ title: data?.title }];

export default function PermissionsRoute() {
  const data = useLoaderData<LoaderData>();
  const appData = useAppData();

  return (
    <div>
      <PermissionsTable items={data.items} canCreate={false} canUpdate={false} tenantId={appData.currentTenant.id} />
    </div>
  );
}
