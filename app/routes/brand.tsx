// @@@ pwned by 1m4unkn0wn @@@
import { LoaderFunctionArgs, MetaFunction } from "react-router";
import HeaderBlock from "~/modules/pageBlocks/components/blocks/marketing/header/HeaderBlock";
import FooterBlock from "~/modules/pageBlocks/components/blocks/marketing/footer/FooterBlock";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import { getDefaultSiteTags } from "~/modules/pageBlocks/utils/defaultSeoMetaTags";
import { getLinkTags } from "~/modules/pageBlocks/services/.server/pagesService";
import { getTranslations } from "~/locale/i18next.server";
import PreviewIcon from "~/components/ui/logo-and-icon/PreviewIcon";
import HeadingBlock from "~/modules/pageBlocks/components/blocks/marketing/heading/HeadingBlock";
import { useTranslation } from "react-i18next";
import PreviewLogo from "~/components/ui/logo-and-icon/PreviewLogo";

export const meta: MetaFunction<typeof loader> = ({ data }) => (data && "metatags" in data ? data.metatags : []);

type LoaderData = {
  metatags: MetaTagsDto;
};
export let loader = async ({ request }: LoaderFunctionArgs) => {
  const { t } = await getTranslations(request);
  const data: LoaderData = {
    metatags: [{ title: `${t("front.brand.title")} | ${getDefaultSiteTags().title}` }, { description: t("affiliates.description") }, ...getLinkTags(request)],
  };
  return data;
};

export default function () {
  const { t } = useTranslation();
  return (
    <div>
      <div>
        <HeaderBlock />
        <HeadingBlock
          item={{
            style: "centered",
            headline: t("front.brand.title"),
            subheadline: t("front.brand.description"),
          }}
        />
        <div className="bg-background container mx-auto max-w-3xl space-y-6 py-8">
          <div className="space-y-2">
            <div className="font-black">{t("shared.icon")}</div>
            <PreviewIcon />
          </div>
          <div className="space-y-2">
            <div className="font-black">{t("shared.logo")}</div>
            <PreviewLogo />
          </div>
        </div>
        <FooterBlock />
      </div>
    </div>
  );
}
