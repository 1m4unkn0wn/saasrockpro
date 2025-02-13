// @@@ pwned by 1m4unkn0wn @@@
import { LoaderFunctionArgs } from "react-router";
import { cachified } from "~/utils/cache.server";
import AnalyticsService from "~/utils/helpers/.server/AnalyticsService";
import PeriodHelper, { PeriodFilters, defaultPeriodFilter } from "~/utils/helpers/PeriodHelper";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    if (!process.env.ANALYTICS_TOKEN) {
      throw Error("ANALYTICS_TOKEN not set");
    }
    if (process.env.ANALYTICS_TOKEN.toString() === "1234567890") {
      throw Error("ANALYTICS_TOKEN cannot be default value");
    }
    const apiAnalyticsHeader = request.headers.get("X-ANALYTICS-TOKEN");
    if (!apiAnalyticsHeader || apiAnalyticsHeader !== process.env.ANALYTICS_TOKEN) {
      throw Error("Invalid API token");
    }

    const searchParams = new URL(request.url).searchParams;
    const period = searchParams.get("period") || defaultPeriodFilter;

    const validPeriod = PeriodFilters.find((p) => p.value === period);
    if (!validPeriod) {
      throw Error(`Invalid period ${period}. Valid periods are ${PeriodFilters.map((p) => p.value).join(", ")}`);
    }

    console.log({ period });

    const data = await cachified({
      key: `analytics:public:${period}`,
      ttl: 60 * 60 * 24,
      getFreshValue: () =>
        AnalyticsService.getAnalyticsOverview({
          withUsers: false,
          period: PeriodHelper.getPeriodFromRequest({ request }),
          portalId: null,
        }),
    });

    return Response.json(data);
  } catch (e: any) {
    console.log("analytics error", e.message);
    return Response.json({ error: e.message }, { status: 401 });
  }
};
