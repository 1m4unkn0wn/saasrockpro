// @@@ pwned by 1m4unkn0wn @@@
import { WorkflowCredential } from "@prisma/client";
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "react-router";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import { deleteWorkflowCredential, getAllWorkflowCredentials } from "~/modules/workflowEngine/db/workflowCredentials.db.server";
import UrlUtils from "~/utils/app/UrlUtils";
import { requireAuth } from "~/utils/loaders.middleware";
import { getTenantIdOrNull } from "~/utils/services/.server/urlService";

export namespace WorkflowsCredentialsApi {
  export type LoaderData = {
    metatags: MetaTagsDto;
    items: WorkflowCredential[];
  };
  export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    await requireAuth({ request, params });
    const tenantId = await getTenantIdOrNull({ request, params });
    const items = await getAllWorkflowCredentials({ tenantId });
    const data: LoaderData = {
      metatags: [{ title: `Workflow Credentials | ${process.env.APP_NAME}` }],
      items,
    };
    return data;
  };

  export const action = async ({ request, params }: ActionFunctionArgs) => {
    await requireAuth({ request, params });
    const tenantId = await getTenantIdOrNull({ request, params });
    const form = await request.formData();
    const action = form.get("action")?.toString();
    if (action === "delete") {
      const id = form.get("id")?.toString() ?? "";
      await deleteWorkflowCredential(id, { tenantId });
      throw redirect(UrlUtils.getModulePath(params, `workflow-engine/credentials`));
    } else {
      return Response.json({ error: "Invalid form" }, { status: 400 });
    }
  };
}
