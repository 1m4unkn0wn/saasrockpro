// @@@ pwned by 1m4unkn0wn @@@
import { LoaderFunctionArgs, MetaFunction, useLoaderData } from "react-router";
import HeaderBlock from "~/modules/pageBlocks/components/blocks/marketing/header/HeaderBlock";
import FooterBlock from "~/modules/pageBlocks/components/blocks/marketing/footer/FooterBlock";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import { getDefaultSiteTags } from "~/modules/pageBlocks/utils/defaultSeoMetaTags";
import { getLinkTags } from "~/modules/pageBlocks/services/.server/pagesService";
import EmptyState from "~/components/ui/emptyState/EmptyState";
import { getBaseURL } from "~/utils/url.server";
import { getTranslations } from "~/locale/i18next.server";
import { getAllSurveys, SurveyWithDetails } from "~/modules/surveys/db/surveys.db.server";
import { HoverEffect } from "~/components/aceternity/HoverEffect";
import HeadingBlock from "~/modules/pageBlocks/components/blocks/marketing/heading/HeadingBlock";
import { useTranslation } from "react-i18next";
import DateUtils from "~/utils/shared/DateUtils";
import { getAppConfiguration } from "~/utils/db/appConfiguration.db.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => data?.metatags || [];

type LoaderData = {
  metatags: MetaTagsDto;
  items: SurveyWithDetails[];
};
export let loader = async ({ request }: LoaderFunctionArgs) => {
  const appConfiguration = await getAppConfiguration({ request });
  if (!appConfiguration.app.features.surveys) {
    throw Response.json({}, { status: 404 });
  }
  const { t } = await getTranslations(request);
  const title = `${t("surveys.title")} | ${getDefaultSiteTags().title}`;
  // const image = "https://yahooder.sirv.com/saasrock/templates/cover.png";
  const description = t("surveys.description");
  const data: LoaderData = {
    metatags: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      // { property: "og:image", content: image },
      { property: "og:url", content: `${getBaseURL(request)}/surveys` },
      { property: "twitter:title", content: title },
      { property: "twitter:description", content: description },
      // { property: "twitter:image", content: image },
      // { property: "twitter:card", content: "summary_large_image" },
      ...getLinkTags(request),
    ],
    items: await getAllSurveys({ tenantId: null, isPublic: true }),
  };
  return data;
};

export default function () {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();
  return (
    <div>
      <div>
        <HeaderBlock />
        <div className="py-4">
          <HeadingBlock
            item={{
              style: "centered",
              headline: t("surveys.title"),
              subheadline: t("surveys.description"),
            }}
          />
        </div>
        <div className="mx-auto min-h-screen max-w-5xl space-y-8 px-6 py-6">
          <div className="mx-auto max-w-5xl">
            {data.items.length === 0 ? (
              <div>
                <EmptyState captions={{ description: "There are currently no surveys available." }} />
              </div>
            ) : (
              <div className="space-y-2">
                <h3 className="px-2 text-xl font-semibold">{t("surveys.title")}</h3>
                <HoverEffect
                  items={data.items.map((item) => ({
                    className: item.isEnabled ? "bg-green-200/50 dark:bg-green-500/90 dark:text-white" : undefined,
                    disabled: !item.isEnabled,
                    name: item.title,
                    description: item.description || "",
                    link: {
                      href: `/surveys/${item.slug}`,
                    },
                    highlight: {
                      text: DateUtils.dateAgo(item.createdAt),
                    },
                    subFeatures: [{ name: item._count.submissions + " " + t("surveys.submission.plural").toLowerCase() }],
                  }))}
                />
              </div>
            )}
          </div>
        </div>
        <FooterBlock />
      </div>
    </div>
  );
}
