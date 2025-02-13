// @@@ pwned by 1m4unkn0wn @@@
import { LoaderFunctionArgs, redirect, useLoaderData } from "react-router";
import PromptFlowOutputForm from "~/modules/promptBuilder/components/outputs/PromptFlowOutputForm";
import { createPromptFlowOutput } from "~/modules/promptBuilder/db/promptFlowOutputs.db.server";
import { PromptFlowWithDetails, getPromptFlow } from "~/modules/promptBuilder/db/promptFlows.db.server";
import { EntityWithDetails, getAllEntities } from "~/utils/db/entities/entities.db.server";

type LoaderData = {
  promptFlow: PromptFlowWithDetails;
  allEntities: EntityWithDetails[];
};
export const loader = async ({ params }: LoaderFunctionArgs) => {
  const promptFlow = await getPromptFlow(params.id!);
  if (!promptFlow) {
    return redirect("/admin/prompts/builder");
  }
  const data: LoaderData = {
    promptFlow,
    allEntities: await getAllEntities({ tenantId: null }),
  };
  return Response.json(data);
};

export const action = async ({ request, params }: LoaderFunctionArgs) => {
  const form = await request.formData();
  const action = form.get("action")?.toString();
  if (action === "new") {
    try {
      const type = form.get("type")?.toString() ?? "";
      const entityId = form.get("entityId")?.toString() ?? "";
      if (!type || !entityId) {
        throw Error("Type and entity are required");
      }
      await createPromptFlowOutput({
        promptFlowId: params.id!,
        type,
        entityId,
      });
      return redirect(`/admin/prompts/builder/${params.id}/outputs`);
    } catch (e: any) {
      return Response.json({ error: e.message }, { status: 400 });
    }
  } else {
    return Response.json({ error: "Invalid action" }, { status: 400 });
  }
};

export default function () {
  const data = useLoaderData<LoaderData>();

  return (
    <div>
      <PromptFlowOutputForm item={undefined} promptFlow={data.promptFlow} allEntities={data.allEntities} />
    </div>
  );
}
