// @@@ pwned by 1m4unkn0wn @@@
import { PromptFlowGroup } from "@prisma/client";
import { LoaderFunctionArgs, ActionFunctionArgs, redirect, useLoaderData, useActionData } from "react-router";
import { useSubmit } from "react-router";
import { useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import ConfirmModal, { RefConfirmModal } from "~/components/ui/modals/ConfirmModal";
import TabsWithIcons from "~/components/ui/tabs/TabsWithIcons";
import { getTranslations } from "~/locale/i18next.server";
import { OpenAIDefaults } from "~/modules/ai/utils/OpenAIDefaults";
import PromptFlowForm from "~/modules/promptBuilder/components/PromptFlowForm";
import { getAllPromptFlowGroups } from "~/modules/promptBuilder/db/promptFlowGroups.db.server";
import { PromptFlowWithDetails, getPromptFlow, updatePromptFlow, deletePromptFlow, createPromptFlow } from "~/modules/promptBuilder/db/promptFlows.db.server";
import { EntityWithDetails, getAllEntities } from "~/utils/db/entities/entities.db.server";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";

type LoaderData = {
  item: PromptFlowWithDetails;
  allEntities: EntityWithDetails[];
  promptFlowGroups: PromptFlowGroup[];
};
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const item = await getPromptFlow(params.id!);
  await verifyUserHasPermission(request, "admin.prompts.update");
  if (!item) {
    return redirect("/admin/prompts/builder");
  }
  const data: LoaderData = {
    item,
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

  const item = await getPromptFlow(params.id!);
  if (!item) {
    return redirect("/admin/prompts/builder");
  }

  if (action === "edit") {
    const title = form.get("title")?.toString() ?? "";
    const description = form.get("description")?.toString() ?? "";
    const actionTitle = form.get("actionTitle")?.toString();
    // const executionType = form.get("executionType")?.toString() ?? "sequential";
    const model = form.get("model")?.toString() ?? OpenAIDefaults.model;
    // const stream = Boolean(form.get("stream"));
    const promptFlowGroupId = form.get("promptFlowGroupId")?.toString() ?? null;
    const inputEntityId = form.get("inputEntityId")?.toString() ?? null;
    const isPublic = Boolean(form.get("isPublic"));

    if (!title || !model) {
      return Response.json({ error: "Missing required fields." }, { status: 400 });
    }
    // if (templates.length === 0) {
    //   return Response.json({ error: "Missing templates." }, { status: 400 });
    // }

    try {
      await updatePromptFlow(item.id, {
        model,
        // stream,
        title,
        description,
        actionTitle: actionTitle ?? null,
        // executionType,
        promptFlowGroupId: !promptFlowGroupId?.length ? null : promptFlowGroupId,
        inputEntityId: !inputEntityId?.length ? null : inputEntityId,
        isPublic,
      });
      return Response.json({
        success: t("shared.saved"),
      });
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error(e.message);
      return Response.json({ error: e.message }, { status: 400 });
    }
  } else if (action === "delete") {
    await deletePromptFlow(params.id!);
    return redirect("/admin/prompts/builder");
  } else if (action === "duplicate") {
    try {
      const created = await createPromptFlow({
        model: item.model,
        stream: item.stream,
        title: `${item.title} (copy)`,
        description: `${item.description} (copy)`,
        actionTitle: `${item.actionTitle} (copy)`,
        executionType: item.executionType,
        promptFlowGroupId: item.promptFlowGroupId ?? null,
        inputEntityId: item.inputEntityId,
        isPublic: false,
        templates: item.templates.map((template) => ({
          order: template.order,
          title: template.title,
          template: template.template,
          temperature: Number(template.temperature),
          maxTokens: template.maxTokens,
        })),
        inputVariables: item.inputVariables.map((inputVariable) => ({
          name: inputVariable.name,
          type: inputVariable.type,
          title: inputVariable.title,
          isRequired: inputVariable.isRequired,
        })),
      });
      if (item.outputs.length > 0) {
        await updatePromptFlow(created.id, {
          outputs: item.outputs.map((output) => ({
            type: output.type,
            entityId: output.entityId,
            mappings: output.mappings.map((mapping) => {
              const template = created.templates.find((t) => t.title === mapping.promptTemplate.title);
              return {
                promptTemplateId: template!.id,
                propertyId: mapping.propertyId,
              };
            }),
          })),
        });
      }
      return redirect(`/admin/prompts/builder/${created.id}`);
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error(e.message);
      return Response.json({ error: e.message }, { status: 400 });
    }
  } else {
    return Response.json({ error: t("shared.invalidForm") }, { status: 400 });
  }
};

export default function () {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const submit = useSubmit();

  const confirmDelete = useRef<RefConfirmModal>(null);

  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData.error);
    } else if (actionData?.success) {
      toast.success(actionData.success);
    }
  }, [actionData]);

  function onDelete() {
    confirmDelete.current?.show(t("shared.confirmDelete"), t("shared.delete"), t("shared.cancel"), t("shared.warningCannotUndo"));
  }
  function onDeleteConfirmed() {
    const form = new FormData();
    form.set("action", "delete");
    submit(form, {
      method: "post",
    });
  }
  function onDuplicate() {
    const form = new FormData();
    form.set("action", "duplicate");
    submit(form, {
      method: "post",
    });
  }
  return (
    <div className="space-y-2">
      <TabsWithIcons
        tabs={[
          { name: "Settings", href: `/admin/prompts/builder/${data.item.id}`, current: true },
          { name: "Variables", href: `/admin/prompts/builder/${data.item.id}/variables`, current: false },
          { name: "Templates", href: `/admin/prompts/builder/${data.item.id}/templates`, current: false },
          { name: "Outputs", href: `/admin/prompts/builder/${data.item.id}/outputs`, current: false },
        ]}
      />

      <div className="mx-auto max-w-lg">
        <PromptFlowForm
          key={data.item.id}
          promptFlowGroups={data.promptFlowGroups}
          item={data.item}
          onDelete={onDelete}
          allEntities={data.allEntities}
          onDuplicate={onDuplicate}
        />
      </div>

      <ConfirmModal ref={confirmDelete} onYes={onDeleteConfirmed} />
    </div>
  );
}
