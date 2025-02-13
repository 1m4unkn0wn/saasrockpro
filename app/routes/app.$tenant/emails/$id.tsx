// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunction, LoaderFunctionArgs } from "react-router";
import { actionInboundEmailEdit } from "~/modules/emails/actions/inbound-email-edit";
import { loaderEmailEdit } from "~/modules/emails/loaders/inbound-email-edit";
import InboundEmailRoute from "~/modules/emails/routes/InboundEmailEditRoute";
import UrlUtils from "~/utils/app/UrlUtils";
import { getTenantIdFromUrl } from "~/utils/services/.server/urlService";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const tenantId = await getTenantIdFromUrl(params);
  return Response.json(await loaderEmailEdit(request, params, tenantId, UrlUtils.currentTenantUrl(params, "emails")));
};

export const action: ActionFunction = async ({ request, params }) => {
  return await actionInboundEmailEdit(request, params, UrlUtils.currentTenantUrl(params, "emails"));
};

export default InboundEmailRoute;
