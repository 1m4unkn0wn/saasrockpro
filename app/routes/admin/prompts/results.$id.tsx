// @@@ pwned by 1m4unkn0wn @@@
import { LoaderFunction, redirect, useLoaderData } from "react-router";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import { getTranslations } from "~/locale/i18next.server";
import PromptResults from "~/modules/promptBuilder/components/PromptResults";
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
    title: `${item.title} | Results | ${t("prompts.builder.title")} | ${process.env.APP_NAME}`,
    item,
  };
  return Response.json(data);
};

export const meta: v2MetaFunction<LoaderData> = ({ data }) => [{ title: data?.title }];

export default function () {
  const data = useLoaderData<LoaderData>();
  return (
    <EditPageLayout
      title={`All Results - ${data.item.title}`}
      menu={[
        {
          title: "Prompts",
          routePath: "/admin/prompts/builder",
        },
        {
          title: "Executions",
          routePath: `/admin/prompts/executions/${data.item.id}`,
        },
        {
          title: "All Results",
          routePath: `/admin/prompts/results/${data.item.id}`,
        },
      ]}
    >
      <PromptResults item={data.item} />
    </EditPageLayout>
  );
}
