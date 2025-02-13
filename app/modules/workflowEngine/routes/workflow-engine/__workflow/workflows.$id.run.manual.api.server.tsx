// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "react-router";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import { WorkflowDto } from "~/modules/workflowEngine/dtos/WorkflowDto";
import { WorkflowExecutionDto } from "~/modules/workflowEngine/dtos/WorkflowExecutionDto";
import WorkflowsExecutionsService from "~/modules/workflowEngine/services/WorkflowsExecutionsService";
import WorkflowsService from "~/modules/workflowEngine/services/WorkflowsService";
import UrlUtils from "~/utils/app/UrlUtils";
import { requireAuth } from "~/utils/loaders.middleware";
import { getTenantIdOrNull } from "~/utils/services/.server/urlService";
import { getUserInfo } from "~/utils/session.server";

export namespace WorkflowsIdRunManualApi {
  export type LoaderData = {
    metatags: MetaTagsDto;
    workflow: WorkflowDto;
  };
  export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    await requireAuth({ request, params });
    const tenantId = await getTenantIdOrNull({ request, params });
    const workflow = await WorkflowsService.get(params.id!, {
      tenantId,
    });
    if (!workflow) {
      throw redirect(UrlUtils.getModulePath(params, `workflow-engine/workflows`));
    }
    const data: LoaderData = {
      metatags: [{ title: `Run Workflow (Manual): ${workflow.name} | ${process.env.APP_NAME}` }],
      workflow,
    };
    return data;
  };

  export type ActionData = {
    success?: string;
    error?: string;
    execution?: WorkflowExecutionDto;
  };
  export const action = async ({ request, params }: ActionFunctionArgs) => {
    await requireAuth({ request, params });
    const tenantId = await getTenantIdOrNull({ request, params });
    const { userId } = await getUserInfo(request);
    const form = await request.formData();
    const action = form.get("action")?.toString();
    if (action === "execute") {
      try {
        let input = form.get("input")?.toString() ?? "{}";
        let inputData: { [key: string]: any } | null = null;
        if (!input.trim()) {
          input = "{}";
        }
        if (input) {
          try {
            inputData = JSON.parse(input);
          } catch {
            throw Error("Input data is not valid JSON: " + input);
          }
        }
        const execution = await WorkflowsExecutionsService.execute(params.id!, {
          type: "manual",
          input: inputData,
          session: {
            tenantId,
            userId,
          },
        });
        if (execution.status === "error") {
          return Response.json(
            {
              error: "Workflow execution failed: " + execution.error,
              execution,
            },
            { status: 400 }
          );
        }
        return Response.json({ success: "Workflow executed", execution });
      } catch (e: any) {
        return Response.json({ error: e.message }, { status: 400 });
      }
    } else if (action === "continue-execution") {
      try {
        const executionId = form.get("executionId")?.toString() ?? "";
        const execution = await WorkflowsExecutionsService.continueExecution(executionId, {
          type: "manual",
          input: { input: form.get("input")?.toString() },
          session: { tenantId, userId },
        });
        if (execution.status === "error") {
          return Response.json({ error: "Workflow execution failed: " + execution.error }, { status: 400 });
        }
        return Response.json({ success: "Workflow executed", execution });
      } catch (e: any) {
        return Response.json({ error: e.message }, { status: 400 });
      }
    }
    return Response.json({ error: "Invalid action" }, { status: 400 });
  };
}
