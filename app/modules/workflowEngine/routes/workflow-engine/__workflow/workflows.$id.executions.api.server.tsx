// @@@ pwned by 1m4unkn0wn @@@
import { LoaderFunctionArgs, redirect } from "react-router";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import { WorkflowDto } from "~/modules/workflowEngine/dtos/WorkflowDto";
import { WorkflowExecutionDto } from "~/modules/workflowEngine/dtos/WorkflowExecutionDto";
import WorkflowsService from "~/modules/workflowEngine/services/WorkflowsService";
import UrlUtils from "~/utils/app/UrlUtils";
import { requireAuth } from "~/utils/loaders.middleware";
import { getTenantIdOrNull } from "~/utils/services/.server/urlService";

export namespace WorkflowsIdExecutionsApi {
  export type LoaderData = {
    metatags: MetaTagsDto;
    item: WorkflowDto;
    executions: WorkflowExecutionDto[];
  };
  export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    await requireAuth({ request, params });
    const tenantId = await getTenantIdOrNull({ request, params });
    const item = await WorkflowsService.get(params.id!, { tenantId });
    if (!item) {
      throw redirect(UrlUtils.getModulePath(params, `workflow-engine/workflows`));
    }
    const executions = await WorkflowsService.getExecutions(item, { tenantId });
    const data: LoaderData = {
      metatags: [{ title: `Workflow Executions: ${item.name} | ${process.env.APP_NAME}` }],
      item,
      executions,
    };
    return data;
  };
}
