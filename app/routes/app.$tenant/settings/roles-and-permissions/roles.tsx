// @@@ pwned by 1m4unkn0wn @@@
import { LoaderFunctionArgs, MetaFunction, useLoaderData } from "react-router";
import { getTranslations } from "~/locale/i18next.server";
import RolesTable from "~/components/core/roles/RolesTable";
import { getAllRolesWithUsers, RoleWithPermissionsAndUsers } from "~/utils/db/permissions/roles.db.server";
import { useAppData } from "~/utils/data/useAppData";
import { requireAuth } from "~/utils/loaders.middleware";

type LoaderData = {
  title: string;
  items: RoleWithPermissionsAndUsers[];
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await requireAuth({ request, params });
  const { t } = await getTranslations(request);

  const items = await getAllRolesWithUsers("app");

  const data: LoaderData = {
    title: `${t("models.role.plural")} | ${process.env.APP_NAME}`,
    items,
  };
  return data;
};

export const meta: MetaFunction<typeof loader> = ({ data }) => [{ title: data?.title }];

export default function RolesRoute() {
  const data = useLoaderData<LoaderData>();
  const appData = useAppData();

  return (
    <div>
      <RolesTable items={data.items} canUpdate={false} tenantId={appData.currentTenant.id} />
    </div>
  );
}
