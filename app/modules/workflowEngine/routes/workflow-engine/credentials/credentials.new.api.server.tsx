// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "react-router";
import UrlUtils from "~/utils/app/UrlUtils";
import { createWorkflowCredential, getWorkflowCredentialByName } from "~/modules/workflowEngine/db/workflowCredentials.db.server";
import { getTenantIdOrNull } from "~/utils/services/.server/urlService";
import CryptoApi from "~/utils/api/.server/CryptoApi";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import { getUserInfo } from "~/utils/session.server";
import { requireAuth } from "~/utils/loaders.middleware";

export namespace WorkflowsCredentialsNewApi {
  export type LoaderData = {
    metatags: MetaTagsDto;
  };
  export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    await requireAuth({ request, params });
    const data: LoaderData = {
      metatags: [{ title: `New Workflows Credential | ${process.env.APP_NAME}` }],
    };
    return data;
  };
  export const action = async ({ request, params }: ActionFunctionArgs) => {
    const tenantId = await getTenantIdOrNull({ request, params });
    const userInfo = await getUserInfo(request);

    const form = await request.formData();
    const action = form.get("action")?.toString() ?? "";
    const name = form.get("credential-name")?.toString() ?? "";
    let value = form.get("credential-value")?.toString() ?? "";

    if (action === "create") {
      try {
        const existing = await getWorkflowCredentialByName(name, { tenantId });
        if (existing) {
          throw Error("Credential already exists with name: " + name);
        }
        value = CryptoApi.encrypt(value);
        await createWorkflowCredential({
          tenantId,
          createdByUserId: userInfo.userId,
          name,
          value,
        });
        throw redirect(UrlUtils.getModulePath(params, `workflow-engine/credentials`));
      } catch (e: any) {
        return Response.json({ error: e.message }, { status: 400 });
      }
    }
    return Response.json({ error: "Invalid action" }, { status: 400 });
  };
}
