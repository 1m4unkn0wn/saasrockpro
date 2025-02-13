// @@@ pwned by 1m4unkn0wn @@@
import { PromptFlowGroup } from "@prisma/client";
import { ActionFunctionArgs, LoaderFunctionArgs, redirect, useActionData, useLoaderData } from "react-router";
import { useNavigate } from "react-router";
import ActionResultModal from "~/components/ui/modals/ActionResultModal";
import SlideOverWideEmpty from "~/components/ui/slideOvers/SlideOverWideEmpty";
import { getTranslations } from "~/locale/i18next.server";
import PromptFlowForm from "~/modules/promptBuilder/components/PromptFlowForm";
import { getAllPromptFlowGroups } from "~/modules/promptBuilder/db/promptFlowGroups.db.server";
import { createPromptFlow } from "~/modules/promptBuilder/db/promptFlows.db.server";
import { EntityWithDetails, getAllEntities } from "~/utils/db/entities/entities.db.server";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";

type LoaderData = {
  allEntities: EntityWithDetails[];
  promptFlowGroups: PromptFlowGroup[];
};
export const loader = async ({ request }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.prompts.create");
  const data: LoaderData = {
    allEntities: await getAllEntities({ tenantId: null }),
    promptFlowGroups: await getAllPromptFlowGroups(),
  };
  return Response.json(data);
};

type ActionData = {
  error?: string;
  success?: string;
};
export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { t } = await getTranslations(request);
  const form = await request.formData();
  const action = form.get("action")?.toString();

  if (action === "new") {
    const title = form.get("title")?.toString() ?? "";
    const description = form.get("description")?.toString() ?? "";
    const actionTitle = form.get("actionTitle")?.toString();
    // const executionType = form.get("executionType")?.toString() ?? "sequential";
    const model = form.get("model")?.toString() ?? "gpt-3.5-turbo";
    const inputEntityId = form.get("inputEntityId")?.toString() ?? null;
    const isPublic = Boolean(form.get("isPublic"));
    // const stream = Boolean(form.get("stream"));

    if (!title || !model) {
      return Response.json({ error: "Missing required fields." }, { status: 400 });
    }
    // if (templates.length === 0) {
    //   return Response.json({ error: "Missing templates." }, { status: 400 });
    // }

    try {
      const { id } = await createPromptFlow({
        model,
        stream: false,
        title,
        description,
        actionTitle: actionTitle ?? null,
        executionType: "sequential",
        promptFlowGroupId: null,
        inputEntityId: !inputEntityId?.length ? null : inputEntityId,
        isPublic: isPublic !== undefined ? isPublic : true,
        templates: [],
      });
      return redirect(`/admin/prompts/builder/${id}/templates`);
    } catch (e: any) {
      return Response.json({ error: e.message }, { status: 400 });
    }
  } else {
    return Response.json({ error: t("shared.invalidForm") }, { status: 400 });
  }
};

export default function () {
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const navigate = useNavigate();

  return (
    <div>
      <SlideOverWideEmpty
        title={"Prompt Flow"}
        description="Create a new prompt flow."
        open={true}
        onClose={() => {
          navigate("/admin/prompts/builder");
        }}
        className="sm:max-w-sm"
        overflowYScroll={true}
      >
        <PromptFlowForm promptFlowGroups={data.promptFlowGroups} item={undefined} allEntities={data.allEntities} />
      </SlideOverWideEmpty>

      <ActionResultModal actionData={actionData ?? undefined} showSuccess={false} />
    </div>
  );
}
