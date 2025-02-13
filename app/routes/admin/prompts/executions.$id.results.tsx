// @@@ pwned by 1m4unkn0wn @@@
import { LoaderFunction, redirect, useLoaderData } from "react-router";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import { getTranslations } from "~/locale/i18next.server";
import PromptExecutionResults from "~/modules/promptBuilder/components/PromptExecutionResults";
import { getPromptFlowExecution, PromptFlowExecutionWithResults } from "~/modules/promptBuilder/db/promptExecutions.db.server";

type LoaderData = {
  title: string;
  item: PromptFlowExecutionWithResults;
};
export const loader: LoaderFunction = async ({ request, params }) => {
  const { t } = await getTranslations(request);
  const item = await getPromptFlowExecution(params.id ?? "");
  if (!item) {
    return redirect("/admin/prompts/builder");
  }

  const data: LoaderData = {
    title: `${item.flow.title} | Execution Results | ${t("prompts.builder.title")} | ${process.env.APP_NAME}`,
    item,
  };
  return Response.json(data);
};

export default function () {
  const data = useLoaderData<LoaderData>();
  return (
    <EditPageLayout
      withHome={false}
      title={`Execution Results - ${data.item.flow.title}`}
      menu={[
        {
          title: "Prompts",
          routePath: "/admin/prompts/builder",
        },
        {
          title: "Executions",
          routePath: `/admin/prompts/executions/${data.item.flowId}`,
        },
        {
          title: "Results",
          routePath: `/admin/prompts/executions/${data.item.id}/results`,
        },
      ]}
    >
      <PromptExecutionResults item={data.item} />
    </EditPageLayout>
  );
}
