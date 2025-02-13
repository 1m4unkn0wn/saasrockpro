// @@@ pwned by 1m4unkn0wn @@@
import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { FilterablePropertyDto } from "~/application/dtos/data/FilterablePropertyDto";
import { PaginationDto } from "~/application/dtos/data/PaginationDto";
import IndexPageLayout from "~/components/ui/layouts/IndexPageLayout";
import ApiKeyLogsDetails from "~/modules/api/components/ApiKeyLogsDetails";
import { ApiKeyLogDto } from "~/modules/api/dtos/ApiKeyLogDto";
import ApiKeyLogService from "~/modules/api/services/ApiKeyLogService";
import UrlUtils from "~/utils/app/UrlUtils";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import { getTenantIdFromUrl } from "~/utils/services/.server/urlService";

type LoaderData = {
  items: ApiKeyLogDto[];
  filterableProperties: FilterablePropertyDto[];
  pagination: PaginationDto;
};
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const tenantId = await getTenantIdFromUrl(params);
  await verifyUserHasPermission(request, "app.settings.apiKeys.view", tenantId);
  const { items, filterableProperties, pagination } = await ApiKeyLogService.getDetails({ request, params });
  const data: LoaderData = {
    items,
    filterableProperties,
    pagination,
  };
  return data;
};

export default function AdminApiLogsRoute() {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();
  const params = useParams();
  return (
    <IndexPageLayout
      replaceTitleWithTabs={true}
      tabs={[
        {
          name: t("shared.overview"),
          routePath: UrlUtils.getModulePath(params, "api"),
        },
        {
          name: t("models.apiCall.plural"),
          routePath: UrlUtils.getModulePath(params, "api/logs"),
        },
        {
          name: t("models.apiKey.plural"),
          routePath: UrlUtils.getModulePath(params, "api/keys"),
        },
        {
          name: "Docs",
          routePath: UrlUtils.getModulePath(params, "api/docs"),
        },
      ]}
    >
      <ApiKeyLogsDetails data={data} />
    </IndexPageLayout>
  );
}
