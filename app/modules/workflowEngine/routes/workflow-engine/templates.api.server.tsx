// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunction, LoaderFunctionArgs, redirect } from "react-router";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import { getAllWorkflows } from "~/modules/workflowEngine/db/workflows.db.server";
import { WorkflowsTemplateDto } from "~/modules/workflowEngine/dtos/WorkflowsTemplateDto";
import WorkflowEngineTemplatesService from "~/modules/workflowEngine/services/WorkflowsTemplatesService";
import UrlUtils from "~/utils/app/UrlUtils";
import { requireAuth } from "~/utils/loaders.middleware";
import { getTenantIdOrNull } from "~/utils/services/.server/urlService";
import { getUserInfo } from "~/utils/session.server";

export namespace WorkflowsTemplatesApi {
  export type LoaderData = {
    metatags: MetaTagsDto;
  };
  export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    await requireAuth({ request, params });
    const data: LoaderData = {
      metatags: [{ title: `Workflow Templates | ${process.env.APP_NAME}` }],
    };
    return data;
  };
  export type ActionData = {
    previewTemplate?: WorkflowsTemplateDto;
    success?: string;
    error?: string;
  };
  export const action: ActionFunction = async ({ request, params }) => {
    await requireAuth({ request, params });
    const tenantId = await getTenantIdOrNull({ request, params });
    const { userId } = await getUserInfo(request);
    const form = await request.formData();
    const action = form.get("action")?.toString();
    if (action === "preview") {
      try {
        const template = JSON.parse(form.get("configuration")?.toString() ?? "{}") as WorkflowsTemplateDto;
        const allWorkflows = await getAllWorkflows({ tenantId });
        await Promise.all(
          template.workflows.map(async (workflow) => {
            const existing = allWorkflows.find((w) => w.name === workflow.name);
            if (existing) {
              throw Error("Workflow already exists with name: " + workflow.name);
            }
          })
        );
        const workflows = await WorkflowEngineTemplatesService.importWorkflows(template, {
          tenantId,
          userId,
        });
        if (workflows.length === 0) {
          throw Error("Could not create workflow");
        }
        if (workflows.length === 1) {
          throw redirect(UrlUtils.getModulePath(params, `workflow-engine/workflows/${workflows[0].id}`));
        }
        return Response.json({
          success: `Created ${workflows.length} workflows`,
        });
      } catch (error: any) {
        return Response.json({ error: error.message }, { status: 400 });
      }
    } else if (action === "create") {
      try {
        const template = JSON.parse(form.get("configuration")?.toString() ?? "{}") as WorkflowsTemplateDto;
        const workflows = await WorkflowEngineTemplatesService.importWorkflows(template, {
          userId,
          tenantId,
        });
        if (workflows.length === 0) {
          throw Error("Could not create workflow");
        }
        return Response.json({
          success: workflows.map((workflow) => {
            return {
              title: `Workflow "${workflow.name}" with ${workflow.blocks.length} blocks`,
              href: UrlUtils.getModulePath(params, `workflow-engine/workflows/${workflow.id}`),
            };
          }),
        });
      } catch (error: any) {
        return Response.json({ error: error.message }, { status: 400 });
      }
    } else {
      return Response.json({ error: "Invalid form" }, { status: 400 });
    }
  };
}
