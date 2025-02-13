// @@@ pwned by 1m4unkn0wn @@@
import { useLoaderData, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import PostForm from "~/components/blog/PostForm";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import { BlogRoutesEditApi } from "../api/BlogRoutes.Edit.Api";
import UrlUtils from "~/utils/app/UrlUtils";

export default function BlogEditView() {
  const { t } = useTranslation();
  const params = useParams();
  const data = useLoaderData<BlogRoutesEditApi.LoaderData>();
  return (
    <EditPageLayout
      title={t("blog.edit")}
      withHome={false}
      menu={[
        { title: t("blog.title"), routePath: UrlUtils.getModulePath(params, `blog`) },
        { title: t("blog.edit"), routePath: UrlUtils.getModulePath(params, `blog/${params.id}`) },
      ]}
    >
      <PostForm item={data.item} categories={data.categories} tags={data.tags} />
    </EditPageLayout>
  );
}
