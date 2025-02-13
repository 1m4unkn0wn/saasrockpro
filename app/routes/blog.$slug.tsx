// @@@ pwned by 1m4unkn0wn @@@
import FooterBlock from "~/modules/pageBlocks/components/blocks/marketing/footer/FooterBlock";
import HeaderBlock from "~/modules/pageBlocks/components/blocks/marketing/header/HeaderBlock";
import { ActionFunctionArgs, LoaderFunctionArgs, useLoaderData } from "react-router";
import { useTranslation } from "react-i18next";
import { getTranslations } from "~/locale/i18next.server";
import ServerError from "~/components/ui/errors/ServerError";
import { PageLoaderData } from "~/modules/pageBlocks/dtos/PageBlockData";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import HeadingBlock from "~/modules/pageBlocks/components/blocks/marketing/heading/HeadingBlock";
import BlogPostVariantSimple from "~/modules/pageBlocks/components/blocks/marketing/blog/post/BlogPostVariantSimple";
import { v2MetaFunction } from "~/utils/compat/v2MetaFunction";
import { BlogPostBlockDto } from "~/modules/pageBlocks/components/blocks/marketing/blog/post/BlogPostBlockUtils";
import { BlogPostBlockService } from "~/modules/pageBlocks/components/blocks/marketing/blog/post/BlogPostBlockService.server";
import { defaultSocials } from "~/modules/pageBlocks/utils/defaultSocials";

export const meta: v2MetaFunction<PageLoaderData> = ({ data }) => data?.metatags || [];

type LoaderData = {
  metatags: MetaTagsDto;
  blogPostData: BlogPostBlockDto["data"];
};
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { t } = await getTranslations(request);
  const blogPostData = await BlogPostBlockService.load({ request, params, t });
  const data: LoaderData = {
    metatags: blogPostData.metaTags || [
      { title: `${blogPostData.post.title} | ${t("blog.title")} | ${process.env.APP_NAME}` },
      { name: "description", content: blogPostData.post.description },
    ],
    blogPostData,
  };
  return Response.json(data);
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { t } = await getTranslations(request);
  const form = await request.formData();
  const action = form.get("action");
  if (action === "publish") {
    return await BlogPostBlockService.publish({ request, params, t, form });
  }
};

export default function () {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();

  return (
    <div>
      <HeaderBlock />
      <div className="py-4">
        <HeadingBlock
          item={{
            style: "centered",
            headline: t("blog.title"),
            subheadline: t("blog.headline"),
          }}
        />
      </div>

      <BlogPostVariantSimple
        item={{
          style: "simple",
          socials: defaultSocials,
          data: data.blogPostData,
        }}
      />

      <FooterBlock />
    </div>
  );
}

export function ErrorBoundary() {
  return <ServerError />;
}
