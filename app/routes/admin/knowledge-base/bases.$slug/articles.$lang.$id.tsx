// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, redirect, useActionData, useLoaderData } from "react-router";
import { Form, useNavigate, useOutlet, useParams } from "react-router";
import ButtonPrimary from "~/components/ui/buttons/ButtonPrimary";
import ButtonSecondary from "~/components/ui/buttons/ButtonSecondary";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import ActionResultModal from "~/components/ui/modals/ActionResultModal";
import SlideOverWideEmpty from "~/components/ui/slideOvers/SlideOverWideEmpty";
import KbArticleContent from "~/modules/knowledgeBase/components/articles/KbArticleContent";
import { getKbArticleById, updateKnowledgeBaseArticle } from "~/modules/knowledgeBase/db/kbArticles.db.server";
import { KbArticleDto } from "~/modules/knowledgeBase/dtos/KbArticleDto";
import { KnowledgeBaseDto } from "~/modules/knowledgeBase/dtos/KnowledgeBaseDto";
import KnowledgeBaseService from "~/modules/knowledgeBase/service/KnowledgeBaseService.server";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import KnowledgeBaseUtils from "~/modules/knowledgeBase/utils/KnowledgeBaseUtils";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import { getTranslations } from "~/locale/i18next.server";

export const meta: MetaFunction<typeof loader> = ({ data }) => data?.metatags || [];
type LoaderData = {
  metatags: MetaTagsDto;
  knowledgeBase: KnowledgeBaseDto;
  item: KbArticleDto;
};
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.kb.view");
  const { t } = await getTranslations(request);
  const knowledgeBase = await KnowledgeBaseService.get({
    slug: params.slug!,
    request,
  });
  if (!knowledgeBase) {
    throw redirect("/admin/knowledge-base/bases");
  }
  const item = await KnowledgeBaseService.getArticleById({
    kb: knowledgeBase,
    id: params.id!,
    request,
  });
  if (!item) {
    throw redirect(`/admin/knowledge-base/bases/${params.slug!}/articles`);
  }
  const data: LoaderData = {
    metatags: [{ title: `${item.title} | ${knowledgeBase.title} | ${t("knowledgeBase.title")} | ${process.env.APP_NAME}` }],
    knowledgeBase,
    item,
  };
  return data;
};

type ActionData = {
  error?: string;
};
export const action = async ({ request, params }: ActionFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.kb.update");
  const form = await request.formData();
  const action = form.get("action")?.toString() ?? "";

  const item = await getKbArticleById(params.id!);
  if (!item) {
    return Response.json({ error: "Article not found" }, { status: 400 });
  }

  if (action === "togglePublish") {
    if (!item.categoryId) {
      return Response.json({ error: "Article must have a category. Go to settings to set one." }, { status: 400 });
    }
    let publishedAt = item.publishedAt;
    let contentPublished = item.contentPublished;
    if (item.publishedAt) {
      publishedAt = null;
    } else {
      publishedAt = new Date();
      contentPublished = item.contentDraft;
    }

    var text = KnowledgeBaseService.contentAsText(contentPublished);
    await updateKnowledgeBaseArticle(item.id, {
      publishedAt,
      contentPublished,
      contentPublishedAsText: text,
    });

    return Response.json({ success: true });
  }
  return Response.json({ error: "Invalid action" }, { status: 400 });
};

export default function () {
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const params = useParams();
  const outlet = useOutlet();
  const navigate = useNavigate();

  return (
    <Form method="post" className="space-y-6">
      <input type="hidden" name="action" value="togglePublish" hidden readOnly />
      <EditPageLayout
        title={`${data.item.title}`}
        withHome={false}
        menu={[
          { title: "Knowledge Bases", routePath: "/admin/knowledge-base/bases" },
          { title: data.knowledgeBase.title, routePath: `/admin/knowledge-base/bases/${data.knowledgeBase.slug}` },
          { title: "Articles", routePath: `/admin/knowledge-base/bases/${params.slug}/articles` },
          { title: params.lang!, routePath: `/admin/knowledge-base/bases/${params.slug}/articles/${params.lang}` },
          {
            title: data.item.title,
            routePath: `/admin/knowledge-base/bases/${params.slug}/articles/${params.lang}/${params.id}`,
          },
        ]}
        buttons={
          <>
            <ButtonSecondary to="settings">
              <div>Settings</div>
            </ButtonSecondary>
            <ButtonSecondary to="edit">
              <div>Edit latest</div>
            </ButtonSecondary>
            {data.item.publishedAt && (
              <ButtonSecondary to={KnowledgeBaseUtils.getArticleUrl({ kb: data.knowledgeBase, article: data.item, params: {} })} target="_blank">
                <div>Preview</div>
              </ButtonSecondary>
            )}
            <ButtonPrimary type="submit" destructive={!!data.item.publishedAt}>
              {data.item.publishedAt ? <div>Unpublish</div> : <div>Publish</div>}
            </ButtonPrimary>
          </>
        }
      >
        <div className="space-y-2">
          <div className="mx-auto max-w-4xl space-y-3 py-12">
            <KbArticleContent item={data.item} content={data.item.contentDraft} />
          </div>
        </div>

        <ActionResultModal actionData={actionData} showSuccess={false} />

        <SlideOverWideEmpty
          title={"Article settings"}
          open={!!outlet}
          onClose={() => {
            navigate(".", { replace: true });
          }}
          className="sm:max-w-lg"
          overflowYScroll={true}
        >
          <div className="-mx-1 -mt-3">
            <div className="space-y-4">{outlet}</div>
          </div>
        </SlideOverWideEmpty>
      </EditPageLayout>
    </Form>
  );
}
