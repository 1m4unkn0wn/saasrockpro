// @@@ pwned by 1m4unkn0wn @@@
import FooterBlock from "~/modules/pageBlocks/components/blocks/marketing/footer/FooterBlock";
import HeaderBlock from "~/modules/pageBlocks/components/blocks/marketing/header/HeaderBlock";
import { LoaderFunctionArgs, MetaFunction, useLoaderData } from "react-router";
import { useTranslation } from "react-i18next";
import ChangelogIssues, { ChangelogItem } from "~/components/changelog/ChangelogIssues";
import UrlUtils from "~/utils/app/UrlUtils";
import { getCurrentPage } from "~/modules/pageBlocks/services/.server/pagesService";
import PageBlocks from "~/modules/pageBlocks/components/blocks/PageBlocks";
import { PageLoaderData } from "~/modules/pageBlocks/dtos/PageBlockData";
import ButtonPrimary from "~/components/ui/buttons/ButtonPrimary";
import { defaultChangelog } from "~/modules/pageBlocks/utils/defaultChangelog";
import { getTranslations } from "~/locale/i18next.server";
import { Link } from "react-router";

export const meta: MetaFunction<typeof loader> = ({ data }) => data?.metatags || [];

type LoaderData = PageLoaderData & {
  items: ChangelogItem[];
};
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { t } = await getTranslations(request);
  const page = await getCurrentPage({ request, params, slug: "/changelog" });

  return {
    ...page,
    items: defaultChangelog({ t }),
  };
};

export default function ChangelogRoute() {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();

  return (
    <div>
      <div>
        <HeaderBlock />
        <PageBlocks items={data.blocks} />
        <div className="bg-background">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="sm:align-center sm:flex sm:flex-col">
              <div className="relative mx-auto w-full max-w-2xl overflow-hidden px-2 py-12 sm:py-6">
                <div className="text-center">
                  <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{t("front.changelog.title")}</h1>
                  <p className="text-muted-foreground mt-4 text-lg leading-6">{t("front.changelog.headline")}</p>
                </div>
                <div className="mx-auto mt-12">
                  <div className="prose dark:prose-invert text-sm">
                    <div className="border-border relative border-l">
                      {data.items.map((item, idx) => {
                        return (
                          <div key={idx} className="mb-10 ml-4">
                            <div className="border-border bg-background absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border"></div>
                            <time id={UrlUtils.slugify(item.date)} className="text-muted-foreground text-sm font-normal leading-none">
                              {item.date}{" "}
                            </time>
                            {item.url ? (
                              <Link to={item.url}>
                                <h2 id={UrlUtils.slugify(item.date)} className="w-full ">
                                  {item.title}
                                </h2>
                              </Link>
                            ) : (
                              <h2 id={UrlUtils.slugify(item.date)} className="w-full ">
                                {item.title}
                              </h2>
                            )}
                            <p className="text-muted-foreground mb-4 text-base font-normal">{item.description}</p>

                            {item.videos && item.videos.length > 0 && (
                              <div>
                                <h3 className="text-sm font-semibold ">Videos</h3>
                                <ul>
                                  {item.videos.map((video, idx) => {
                                    return (
                                      <li key={idx}>
                                        <a href={video.url} target={video.target} className="text-primary not-prose hover:underline">
                                          🎥 {video.title}
                                        </a>
                                      </li>
                                    );
                                  })}
                                </ul>
                              </div>
                            )}

                            <ChangelogIssues title="Done" items={item.closed} icon="✅" />
                            <ChangelogIssues title="Added issues" items={item.added || []} icon="⌛" />

                            {item.url && (
                              <ButtonPrimary to={item.url} className="not-prose mt-4">
                                {t("shared.learnMore")}{" "}
                                <svg className="ml-2 h-3 w-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                  <path
                                    fillRule="evenodd"
                                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                  ></path>
                                </svg>
                              </ButtonPrimary>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FooterBlock />
      </div>
    </div>
  );
}
