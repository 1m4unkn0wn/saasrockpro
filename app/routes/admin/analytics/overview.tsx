// @@@ pwned by 1m4unkn0wn @@@
import { LoaderFunction } from "react-router";
import { useLoaderData, useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import AnalyticsOverview from "~/components/analytics/AnalyticsOverview";
import IndexPageLayout from "~/components/ui/layouts/IndexPageLayout";
import PeriodHelper, { defaultPeriodFilter, PeriodFilters } from "~/utils/helpers/PeriodHelper";
import AnalyticsService, { AnalyticsOverviewDto } from "~/utils/helpers/.server/AnalyticsService";
import InputSelector from "~/components/ui/input/InputSelector";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";

type LoaderData = {
  overview: AnalyticsOverviewDto;
};
export const loader: LoaderFunction = async ({ request }) => {
  await verifyUserHasPermission(request, "admin.analytics.view");
  const data: LoaderData = {
    overview: await AnalyticsService.getAnalyticsOverview({
      withUsers: true,
      period: PeriodHelper.getPeriodFromRequest({ request }),
      portalId: undefined,
    }),
  };
  return Response.json(data);
};

export default function AdminAnalyticsOverviewRoute() {
  const { t } = useTranslation();
  const { overview } = useLoaderData<LoaderData>();
  const [searchParams, setSearchParams] = useSearchParams();
  return (
    <>
      <IndexPageLayout
        replaceTitleWithTabs={true}
        tabs={[
          {
            name: t("analytics.overview"),
            routePath: "/admin/analytics/overview",
          },
          {
            name: t("analytics.uniqueVisitors"),
            routePath: "/admin/analytics/visitors",
          },
          {
            name: t("analytics.pageViews"),
            routePath: "/admin/analytics/page-views",
          },
          {
            name: t("analytics.events"),
            routePath: "/admin/analytics/events",
          },
          {
            name: t("analytics.settings"),
            routePath: "/admin/analytics/settings",
          },
        ]}
        buttons={
          <>
            <>
              <InputSelector
                className="w-44"
                withSearch={false}
                name="period"
                value={searchParams.get("period")?.toString() ?? defaultPeriodFilter}
                options={PeriodFilters.map((f) => {
                  return {
                    value: f.value,
                    name: t(f.name),
                  };
                })}
                setValue={(value) => {
                  if (value && value !== defaultPeriodFilter) {
                    searchParams.set("period", value?.toString() ?? "");
                  } else {
                    searchParams.delete("period");
                  }
                  setSearchParams(searchParams);
                }}
              />
            </>
          </>
        }
      >
        <AnalyticsOverview overview={overview} withUsers={true} rootUrl="/admin/analytics/" />
      </IndexPageLayout>
    </>
  );
}
