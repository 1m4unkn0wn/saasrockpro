// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import { db } from "~/utils/db.server";
import { requireAuth } from "~/utils/loaders.middleware";
import { getTenantIdOrNull } from "~/utils/services/.server/urlService";

export namespace WorkflowsDangerApi {
  export type LoaderData = {
    metatags: MetaTagsDto;
    summary: {
      workflows: number;
      variables: number;
      credentials: number;
      executions: number;
    };
  };
  export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    await requireAuth({ request, params });
    const tenantId = await getTenantIdOrNull({ request, params });
    const data: LoaderData = {
      metatags: [{ title: `Danger | Workflows | ${process.env.APP_NAME}` }],
      summary: {
        workflows: await db.workflow.count({ where: { tenantId } }),
        credentials: await db.workflowCredential.count({ where: { tenantId } }),
        variables: await db.workflowVariable.count({ where: { tenantId } }),
        executions: await db.workflowExecution.count({ where: { tenantId } }),
      },
    };
    return data;
  };

  export type ActionData = {
    error?: string;
    success?: string;
  };
  export const action = async ({ request, params }: ActionFunctionArgs) => {
    await requireAuth({ request, params });
    const form = await request.formData();
    const tenantId = await getTenantIdOrNull({ request, params });
    const action = form.get("action")?.toString();
    if (action === "reset-all-data") {
      const workflows = await db.workflow.deleteMany({ where: { tenantId } });
      const variables = await db.workflowVariable.deleteMany({ where: { tenantId } });
      const credentials = await db.workflowCredential.deleteMany({ where: { tenantId } });
      return Response.json({ success: `Deleted ${workflows.count} workflows, ${variables.count} variables and ${credentials.count} credentials.` });
    } else if (action === "delete-all-executions") {
      const executions = await db.workflowExecution.deleteMany({ where: { tenantId } });
      return Response.json({ success: `Deleted ${executions.count} executions.` });
    } else if (action === "delete-all-credentials") {
      const credentials = await db.workflowCredential.deleteMany({ where: { tenantId } });
      return Response.json({ success: `Deleted ${credentials.count} credentials.` });
    } else if (action === "delete-all-variables") {
      const variables = await db.workflowVariable.deleteMany({ where: { tenantId } });
      return Response.json({ success: `Deleted ${variables.count} variables.` });
    } else if (action === "delete-all-workflows") {
      const workflows = await db.workflow.deleteMany({ where: { tenantId } });
      return Response.json({ success: `Deleted ${workflows.count} workflows.` });
    } else {
      return Response.json({ error: "Invalid form" }, { status: 400 });
    }
  };
}
