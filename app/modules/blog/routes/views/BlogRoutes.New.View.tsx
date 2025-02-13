// @@@ pwned by 1m4unkn0wn @@@
import { useTranslation } from "react-i18next";
import PostForm from "~/components/blog/PostForm";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import { BlogRoutesNewApi } from "../api/BlogRoutes.New.Api";
import UrlUtils from "~/utils/app/UrlUtils";
import { useLoaderData, useParams } from "react-router";
import CheckPlanFeatureLimit from "~/components/core/settings/subscription/CheckPlanFeatureLimit";

export default function BlogNewView() {
  const { t } = useTranslation();
  const params = useParams();
  const data = useLoaderData<BlogRoutesNewApi.LoaderData>();
  return (
    <EditPageLayout
      title={t("blog.new")}
      withHome={false}
      menu={[
        { title: t("blog.title"), routePath: UrlUtils.getModulePath(params, `blog`) },
        { title: t("blog.new"), routePath: UrlUtils.getModulePath(params, `blog/new`) },
      ]}
    >
      <CheckPlanFeatureLimit item={data.featureUsageEntity}>
        <PostForm categories={data.categories} tags={data.tags} />
      </CheckPlanFeatureLimit>
    </EditPageLayout>
  );
}
