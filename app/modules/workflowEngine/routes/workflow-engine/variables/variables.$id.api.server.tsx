// @@@ pwned by 1m4unkn0wn @@@
import { WorkflowVariable } from "@prisma/client";
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "react-router";
import UrlUtils from "~/utils/app/UrlUtils";
import { deleteWorkflowVariable, getWorkflowVariableById, updateWorkflowVariable } from "~/modules/workflowEngine/db/workflowVariable.db.server";
import { getTenantIdOrNull } from "~/utils/services/.server/urlService";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import { requireAuth } from "~/utils/loaders.middleware";

export namespace WorkflowsVariablesIdApi {
  export type LoaderData = {
    metatags: MetaTagsDto;
    item: WorkflowVariable;
  };
  export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    await requireAuth({ request, params });
    const tenantId = await getTenantIdOrNull({ request, params });
    const item = await getWorkflowVariableById(params.id ?? "", { tenantId });
    if (!item) {
      throw redirect(UrlUtils.getModulePath(params, `workflow-engine/variables`));
    }
    const data: LoaderData = {
      metatags: [{ title: `Edit Workflows Variable | ${process.env.APP_NAME}` }],
      item,
    };
    return data;
  };

  export const action = async ({ request, params }: ActionFunctionArgs) => {
    await requireAuth({ request, params });
    const tenantId = await getTenantIdOrNull({ request, params });
    const existing = await getWorkflowVariableById(params.id ?? "", { tenantId });
    if (!existing) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const form = await request.formData();
    const action = form.get("action")?.toString() ?? "";
    const value = form.get("value")?.toString() ?? "";

    if (action === "edit") {
      try {
        await updateWorkflowVariable(params.id ?? "", {
          value,
        });
        throw redirect(UrlUtils.getModulePath(params, `workflow-engine/variables`));
      } catch (e: any) {
        return Response.json({ error: e.message }, { status: 400 });
      }
    } else if (action === "delete") {
      await deleteWorkflowVariable(existing.id);
      throw redirect(UrlUtils.getModulePath(params, `workflow-engine/variables`));
    }
    return Response.json({ error: "Invalid action" }, { status: 400 });
  };
}
