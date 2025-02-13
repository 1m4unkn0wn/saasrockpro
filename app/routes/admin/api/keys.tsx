// @@@ pwned by 1m4unkn0wn @@@
import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { Outlet } from "react-router";
import { useTranslation } from "react-i18next";
import ApiKeysTable from "~/components/core/apiKeys/ApiKeysTable";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import { useAdminData } from "~/utils/data/useAdminData";
import { ApiKeyWithDetails, getAllApiKeys } from "~/utils/db/apiKeys.db.server";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import { getUserHasPermission } from "~/utils/helpers/PermissionsHelper";

type LoaderData = {
  apiKeys: ApiKeyWithDetails[];
};
export const loader = async ({ request }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.apiKeys.view");
  const apiKeys = await getAllApiKeys();
  const data: LoaderData = {
    apiKeys,
  };
  return data;
};

export default function AdminApiKeysRoute() {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();
  const adminData = useAdminData();
  return (
    <>
      <EditPageLayout title={t("models.apiKey.plural")}>
        <ApiKeysTable
          canCreate={getUserHasPermission(adminData, "admin.apiKeys.create")}
          entities={adminData.entities}
          items={data.apiKeys}
          withTenant={true}
        />
        <Outlet />
      </EditPageLayout>
    </>
  );
}
