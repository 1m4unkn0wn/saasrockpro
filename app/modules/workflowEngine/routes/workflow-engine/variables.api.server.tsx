// @@@ pwned by 1m4unkn0wn @@@
import { WorkflowVariable } from "@prisma/client";
import { LoaderFunctionArgs } from "react-router";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import { getAllWorkflowVariables } from "~/modules/workflowEngine/db/workflowVariable.db.server";
import { requireAuth } from "~/utils/loaders.middleware";
import { getTenantIdOrNull } from "~/utils/services/.server/urlService";

export namespace WorkflowsVariablesApi {
  export type LoaderData = {
    metatags: MetaTagsDto;
    items: WorkflowVariable[];
  };
  export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    await requireAuth({ request, params });
    const tenantId = await getTenantIdOrNull({ request, params });
    const items = await getAllWorkflowVariables({ tenantId });
    const data: LoaderData = {
      metatags: [{ title: `Workflow Variables | ${process.env.APP_NAME}` }],
      items,
    };
    return data;
  };
}
