// @@@ pwned by 1m4unkn0wn @@@
import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { Link, useParams } from "react-router";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { FilterablePropertyDto } from "~/application/dtos/data/FilterablePropertyDto";
import ErrorBanner from "~/components/ui/banners/ErrorBanner";
import ServerError from "~/components/ui/errors/ServerError";
import IndexPageLayout from "~/components/ui/layouts/IndexPageLayout";
import ApiKeyLogsSummary from "~/modules/api/components/ApiKeyLogsSummary";
import { ApiCallSummaryDto } from "~/modules/api/dtos/ApiCallSummaryDto";
import ApiKeyLogService from "~/modules/api/services/ApiKeyLogService";
import UrlUtils from "~/utils/app/UrlUtils";
import { getAppConfiguration } from "~/utils/db/appConfiguration.db.server";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import { getTenantIdFromUrl } from "~/utils/services/.server/urlService";

type LoaderData =
  | { error: string }
  | {
      items: ApiCallSummaryDto[];
      allTenants: { id: string; name: string }[];
      filterableProperties: FilterablePropertyDto[];
    };
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const tenantId = await getTenantIdFromUrl(params);
  await verifyUserHasPermission(request, "app.settings.apiKeys.view", tenantId);
  try {
    const appConfiguration = await getAppConfiguration({ request });
    if (!appConfiguration.app.features.tenantApiKeys) {
      throw Error("API keys are not enabled");
    }
    const { items, filterableProperties } = await ApiKeyLogService.getSummary({ request, params });
    const data: LoaderData = {
      items,
      allTenants: [],
      filterableProperties,
    };
    return data;
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 400 });
  }
};

export default function () {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();
  const params = useParams();
  return (
    <IndexPageLayout
      title={t("shared.overview")}
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
      {"error" in data ? (
        <ErrorBanner title={t(data.error)}>
          <Link to="." className="underline">
            {t("shared.clickHereToTryAgain")}
          </Link>
        </ErrorBanner>
      ) : (
        <Fragment>
          <ApiKeyLogsSummary data={data} />
        </Fragment>
      )}
    </IndexPageLayout>
  );
}

export function ErrorBoundary() {
  return <ServerError />;
}
