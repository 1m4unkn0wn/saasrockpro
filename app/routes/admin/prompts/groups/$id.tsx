// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunctionArgs, LoaderFunctionArgs, redirect, useActionData, useLoaderData } from "react-router";
import { useSubmit } from "react-router";
import ActionResultModal from "~/components/ui/modals/ActionResultModal";
import { getTranslations } from "~/locale/i18next.server";
import PromptGroupForm from "~/modules/promptBuilder/components/PromptGroupForm";
import {
  PromptFlowGroupWithDetails,
  deletePromptFlowGroup,
  getPromptFlowGroup,
  updatePromptFlowGroup,
} from "~/modules/promptBuilder/db/promptFlowGroups.db.server";
import { PromptGroupTemplateDto } from "~/modules/promptBuilder/dtos/PromptGroupTemplateDto";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";

type LoaderData = {
  item: PromptFlowGroupWithDetails;
};
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const item = await getPromptFlowGroup(params.id!);
  await verifyUserHasPermission(request, "admin.prompts.update");
  if (!item) {
    return redirect("/admin/prompts/groups");
  }
  const data: LoaderData = {
    item,
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

  const item = await getPromptFlowGroup(params.id!);
  if (!item) {
    return redirect("/admin/prompts/groups");
  }

  if (action === "edit") {
    const title = form.get("title")?.toString() ?? "";
    const description = form.get("description")?.toString() ?? "";

    const templates: PromptGroupTemplateDto[] = form.getAll("templates[]").map((f) => {
      return JSON.parse(f.toString());
    });

    if (!title) {
      return Response.json({ error: "Missing required fields." }, { status: 400 });
    }
    if (templates.length === 0) {
      return Response.json({ error: "Missing templates." }, { status: 400 });
    }

    try {
      await updatePromptFlowGroup(item.id, {
        title,
        description,
        templates,
      });
    } catch (e: any) {
      // eslint-disable-next-line no-console
      console.error(e.message);
    }

    return redirect("/admin/prompts/groups");
  } else if (action === "delete") {
    await deletePromptFlowGroup(params.id!);
    return redirect("/admin/prompts/groups");
  } else {
    return Response.json({ error: t("shared.invalidForm") }, { status: 400 });
  }
};

export default function () {
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const submit = useSubmit();

  function onDelete() {
    const form = new FormData();
    form.set("action", "delete");
    submit(form, {
      method: "post",
    });
  }
  return (
    <div>
      <PromptGroupForm item={data.item} onDelete={onDelete} />

      <ActionResultModal actionData={actionData ?? undefined} showSuccess={false} />
    </div>
  );
}
