// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunctionArgs, LoaderFunctionArgs, redirect, useLoaderData } from "react-router";
import { useParams, useSubmit } from "react-router";
import KbCategorySectionForm from "~/modules/knowledgeBase/components/bases/KbCategorySectionForm";
import { updateKnowledgeBaseArticle } from "~/modules/knowledgeBase/db/kbArticles.db.server";
import { getKbCategoryById } from "~/modules/knowledgeBase/db/kbCategories.db.server";
import {
  KnowledgeBaseCategorySectionWithDetails,
  deleteKnowledgeBaseCategorySection,
  getKbCategorySectionById,
  updateKnowledgeBaseCategorySection,
} from "~/modules/knowledgeBase/db/kbCategorySections.db.server";
import { KnowledgeBaseDto } from "~/modules/knowledgeBase/dtos/KnowledgeBaseDto";
import { KnowledgeBaseCategoryWithDetails } from "~/modules/knowledgeBase/helpers/KbCategoryModelHelper";
import KnowledgeBaseService from "~/modules/knowledgeBase/service/KnowledgeBaseService.server";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";

type LoaderData = {
  knowledgeBase: KnowledgeBaseDto;
  category: KnowledgeBaseCategoryWithDetails;
  item: KnowledgeBaseCategorySectionWithDetails;
};
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.kb.view");
  const knowledgeBase = await KnowledgeBaseService.get({
    slug: params.slug!,
    request,
  });
  const category = await getKbCategoryById(params.id!);
  if (!category) {
    return redirect(`/admin/knowledge-base/bases/${params.slug}/categories/${params.lang}`);
  }
  const item = await getKbCategorySectionById(params.section!);
  if (!item) {
    return redirect(`/admin/knowledge-base/bases/${params.slug}/categories/${params.lang}/${params.id}`);
  }
  const data: LoaderData = {
    knowledgeBase,
    category,
    item,
  };
  return data;
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.kb.update");
  const form = await request.formData();
  const action = form.get("action")?.toString();

  const item = await getKbCategorySectionById(params.section!);
  if (!item) {
    return redirect(`/admin/knowledge-base/bases/${params.slug}/${params.lang}/${params.id}`);
  }

  if (action === "edit") {
    await verifyUserHasPermission(request, "admin.kb.update");
    const order = Number(form.get("order")?.toString() ?? "");
    const title = form.get("title")?.toString() ?? "";
    const description = form.get("description")?.toString() ?? "";

    try {
      await updateKnowledgeBaseCategorySection(item.id, {
        order,
        title,
        description,
      });
    } catch (e: any) {
      return Response.json({ error: e.message }, { status: 400 });
    }

    return redirect(`/admin/knowledge-base/bases/${params.slug}/categories/${params.lang}`);
  } else if (action === "delete") {
    await verifyUserHasPermission(request, "admin.kb.delete");
    await deleteKnowledgeBaseCategorySection(item.id);
    return redirect(`/admin/knowledge-base/bases/${params.slug}/categories/${params.lang}`);
  } else if (action === "set-orders") {
    await verifyUserHasPermission(request, "admin.kb.update");
    const items: { id: string; order: number }[] = form.getAll("orders[]").map((f: FormDataEntryValue) => {
      return JSON.parse(f.toString());
    });

    await Promise.all(
      items.map(async ({ id, order }) => {
        await updateKnowledgeBaseArticle(id, {
          order: Number(order),
        });
      })
    );
    return Response.json({ updated: true });
  } else {
    return Response.json({ error: "Invalid form" }, { status: 400 });
  }
};

export default function () {
  const data = useLoaderData<LoaderData>();
  const submit = useSubmit();
  const params = useParams();

  function onDelete() {
    const form = new FormData();
    form.set("action", "delete");
    submit(form, {
      method: "post",
    });
  }
  return (
    <div>
      <KbCategorySectionForm knowledgeBase={data.knowledgeBase} category={data.category} language={params.lang!} item={data.item} onDelete={onDelete} />
    </div>
  );
}
