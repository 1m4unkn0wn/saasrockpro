// @@@ pwned by 1m4unkn0wn @@@
import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { Link } from "react-router";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { FilterablePropertyDto } from "~/application/dtos/data/FilterablePropertyDto";
import ErrorBanner from "~/components/ui/banners/ErrorBanner";
import ServerError from "~/components/ui/errors/ServerError";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import ApiKeyLogsSummary from "~/modules/api/components/ApiKeyLogsSummary";
import { ApiCallSummaryDto } from "~/modules/api/dtos/ApiCallSummaryDto";
import ApiKeyLogService from "~/modules/api/services/ApiKeyLogService";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";

type LoaderData =
  | { error: string }
  | {
      items: ApiCallSummaryDto[];
      allTenants: { id: string; name: string; slug: string }[];
      filterableProperties: FilterablePropertyDto[];
    };
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.apiKeys.view");
  try {
    const { items, allTenants, filterableProperties } = await ApiKeyLogService.getSummary({ request, params });
    const data: LoaderData = {
      items,
      allTenants,
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
  return (
    <EditPageLayout title={t("shared.overview")}>
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
    </EditPageLayout>
  );
}

export function ErrorBoundary() {
  return <ServerError />;
}
