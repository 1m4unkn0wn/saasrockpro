// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "react-router";
import UrlUtils from "~/utils/app/UrlUtils";
import { createWorkflowVariable, getWorkflowVariableByName } from "~/modules/workflowEngine/db/workflowVariable.db.server";
import { getTenantIdOrNull } from "~/utils/services/.server/urlService";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import { getUserInfo } from "~/utils/session.server";
import { requireAuth } from "~/utils/loaders.middleware";

export namespace WorkflowsVariablesNewApi {
  export type LoaderData = {
    metatags: MetaTagsDto;
  };
  export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    await requireAuth({ request, params });
    const data: LoaderData = {
      metatags: [{ title: `New Workflows Variable | ${process.env.APP_NAME}` }],
    };
    return data;
  };
  export const action = async ({ request, params }: ActionFunctionArgs) => {
    await requireAuth({ request, params });
    const tenantId = await getTenantIdOrNull({ request, params });
    const userInfo = await getUserInfo(request);

    const form = await request.formData();
    const action = form.get("action")?.toString() ?? "";
    const name = form.get("name")?.toString() ?? "";
    const value = form.get("value")?.toString() ?? "";

    if (action === "create") {
      try {
        const existing = await getWorkflowVariableByName(name, { tenantId });
        if (existing) {
          throw Error("Variable already exists with name: " + name);
        }
        await createWorkflowVariable({
          tenantId,
          createdByUserId: userInfo.userId,
          name,
          value,
        });
        throw redirect(UrlUtils.getModulePath(params, `workflow-engine/variables`));
      } catch (e: any) {
        return Response.json({ error: e.message }, { status: 400 });
      }
    }
    return Response.json({ error: "Invalid action" }, { status: 400 });
  };
}
