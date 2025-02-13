// @@@ pwned by 1m4unkn0wn @@@
import { FeatureFlag } from "@prisma/client";
import { ActionFunction } from "react-router";
import { AnalyticsInfoDto } from "~/application/dtos/marketing/AnalyticsInfoDto";
import { getAnalyticsInfo } from "~/utils/analyticsCookie.server";
import { db } from "~/utils/db.server";
import AnalyticsService from "~/utils/helpers/.server/AnalyticsService";

export function loader() {
  return Response.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, referer-path",
        "Access-Control-Allow-Methods": "GET",
      },
    }
  );
}

export const action: ActionFunction = async ({ request }) => {
  try {
    if (request.method === "OPTIONS") {
      return Response.json(
        {},
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, HEAD, POST, PUT, DELETE",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, referer-path",
          },
        }
      );
    }
    if (request.method !== "POST") {
      return Response.json({ error: "Method not allowed" }, { status: 405 });
    }
    const analyticsSessionInfo = await getAnalyticsInfo(request);

    const jsonBody = (await request.json()) as {
      action: string;
      category: string;
      label: string;
      value: string;
      url: string | undefined;
      route: string | undefined;
      analytics: AnalyticsInfoDto;
      featureFlagId: string | undefined;
    };

    let userAnalyticsId = analyticsSessionInfo?.userAnalyticsId ?? jsonBody.analytics.userAnalyticsId;
    if (!userAnalyticsId) {
      return Response.json({ error: "Invalid Analytics Cookie" }, { status: 401 });
    }

    const uniqueVisitor = await AnalyticsService.getOrCreateUniqueVisitor({
      cookie: userAnalyticsId,
      fromUrl: jsonBody.url,
      fromRoute: jsonBody.route,
      analytics: jsonBody.analytics,
    });
    if (!uniqueVisitor) {
      throw new Error("Unique visitor not found");
    }
    let featureFlag: FeatureFlag | null = null;
    if (jsonBody.category === "featureFlag") {
      featureFlag = await db.featureFlag.findFirst({ where: { name: jsonBody.action } });
    }
    await db.analyticsEvent.create({
      data: {
        uniqueVisitorId: uniqueVisitor.id,
        action: jsonBody.action,
        category: jsonBody.category,
        label: jsonBody.label,
        value: jsonBody.value,
        url: jsonBody.url,
        route: jsonBody.route,
        featureFlagId: featureFlag?.id,
        portalId: jsonBody.analytics.portalId || null,
        portalUserId: jsonBody.analytics.portalUserId || null,
      },
    });

    return Response.json({ success: true }, { status: 201 });
  } catch (e: any) {
    // eslint-disable-next-line no-console
    console.error("Error in analytics events", e.message);
    return Response.json({ error: e.message }, { status: 400 });
  }
};
