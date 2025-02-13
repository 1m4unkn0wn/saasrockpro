// @@@ pwned by 1m4unkn0wn @@@
import FooterBlock from "~/modules/pageBlocks/components/blocks/marketing/footer/FooterBlock";
import HeaderBlock from "~/modules/pageBlocks/components/blocks/marketing/header/HeaderBlock";
import { useEffect } from "react";
import { ActionFunction, LoaderFunctionArgs, useLoaderData } from "react-router";
import { useActionData } from "react-router";
import { useTranslation } from "react-i18next";
import { getTranslations } from "~/locale/i18next.server";
import ServerError from "~/components/ui/errors/ServerError";
import { PageLoaderData } from "~/modules/pageBlocks/dtos/PageBlockData";
import { PricingBlockDto } from "~/modules/pageBlocks/components/blocks/marketing/pricing/PricingBlockUtils";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import toast from "react-hot-toast";
import HeadingBlock from "~/modules/pageBlocks/components/blocks/marketing/heading/HeadingBlock";
import BlogPostsVariantSimple from "~/modules/pageBlocks/components/blocks/marketing/blog/posts/BlogPostsVariantSimple";
import { v2MetaFunction } from "~/utils/compat/v2MetaFunction";
import { PricingBlockService } from "~/modules/pageBlocks/components/blocks/marketing/pricing/PricingBlockService.server";
import { BlogPostsBlockDto } from "~/modules/pageBlocks/components/blocks/marketing/blog/posts/BlogPostsBlockUtils";
import { BlogPostsBlockService } from "~/modules/pageBlocks/components/blocks/marketing/blog/posts/BlogPostsBlockService.server";

export const meta: v2MetaFunction<PageLoaderData> = ({ data }) => data?.metatags || [];

type LoaderData = {
  metatags: MetaTagsDto;
  blogData: BlogPostsBlockDto["data"];
};
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { t } = await getTranslations(request);
  const blogData = await BlogPostsBlockService.load({ request, params, t });
  const data: LoaderData = {
    metatags: [{ title: `${t("blog.title")} | ${process.env.APP_NAME}` }, { name: "description", content: t("blog.headline") }],
    blogData,
  };
  return Response.json(data);
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

      <BlogPostsVariantSimple
        item={{
          style: "simple",
          withCoverImage: true,
          withAuthorName: true,
          withAuthorAvatar: true,
          withDate: true,
          blogPath: "/blog",
          data: data.blogData,
        }}
      />

      <FooterBlock />
    </div>
  );
}

export function ErrorBoundary() {
  return <ServerError />;
}
