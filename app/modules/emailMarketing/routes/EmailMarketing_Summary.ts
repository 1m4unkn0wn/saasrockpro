// @@@ pwned by 1m4unkn0wn @@@
import { LoaderFunctionArgs } from "react-router";
import { getTranslations } from "~/locale/i18next.server";
import { getTenantIdOrNull } from "~/utils/services/.server/urlService";
import EmailMarketingService, { EmailMarketingSummaryDto } from "../services/EmailMarketingService";
import { requireAuth } from "~/utils/loaders.middleware";

export namespace EmailMarketing_Summary {
  export type LoaderData = {
    title: string;
    summary: EmailMarketingSummaryDto;
  };

  export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    await requireAuth({ request, params });
    const { t } = await getTranslations(request);
    const tenantId = await getTenantIdOrNull({ request, params });
    const data: LoaderData = {
      title: `${t("emailMarketing.title")} | ${process.env.APP_NAME}`,
      summary: await EmailMarketingService.getSummary(tenantId),
    };
    return data;
  };
}
