// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunctionArgs, LoaderFunction, redirect, MetaFunction, useLoaderData } from "react-router";
import { useSubmit } from "react-router";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import { getTranslations } from "~/locale/i18next.server";
import PromptExecutions from "~/modules/promptBuilder/components/PromptExecutions";
import { deletePromptFlowExecution, getPromptFlowExecution } from "~/modules/promptBuilder/db/promptExecutions.db.server";
import { getPromptFlowWithExecutions, PromptFlowWithExecutions } from "~/modules/promptBuilder/db/promptFlows.db.server";
import { v2MetaFunction } from "~/utils/compat/v2MetaFunction";

type LoaderData = {
  title: string;
  item: PromptFlowWithExecutions;
};
export const loader: LoaderFunction = async ({ request, params }) => {
  const { t } = await getTranslations(request);
  const item = await getPromptFlowWithExecutions(params.id ?? "");
  if (!item) {
    return redirect("/admin/prompts/builder");
  }

  const data: LoaderData = {
    title: `${item.title} | Executions | ${t("prompts.builder.title")} | ${process.env.APP_NAME}`,
    item,
  };
  return Response.json(data);
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { t } = await getTranslations(request);
  const form = await request.formData();
  const action = form.get("action")?.toString();

  if (action === "delete") {
    const id = form.get("id")?.toString() ?? "";
    const execution = getPromptFlowExecution(id);
    if (!execution) {
      return Response.json({ error: t("shared.notFound") }, { status: 400 });
    }
    await deletePromptFlowExecution(id);
    return Response.json({ success: true });
  } else {
    return Response.json({ error: t("shared.invalidForm") }, { status: 400 });
  }
};

export const meta: v2MetaFunction<LoaderData> = ({ data }) => [{ title: data?.title }];

export default function () {
  const data = useLoaderData<LoaderData>();
  const submit = useSubmit();
  function onDelete(id: string) {
    const form = new FormData();
    form.set("action", "delete");
    form.set("id", id);
    submit(form, {
      method: "post",
    });
  }
  return (
    <EditPageLayout
      title={`Executions - ${data.item.title}`}
      withHome={false}
      menu={[
        {
          title: "Prompts",
          routePath: "/admin/prompts/builder",
        },
        {
          title: "Execution",
          routePath: `/admin/prompts/executions/${data.item.id}`,
        },
      ]}
    >
      <PromptExecutions item={data.item} onDelete={onDelete} />
    </EditPageLayout>
  );
}
