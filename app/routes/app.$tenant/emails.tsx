// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunction, LoaderFunctionArgs } from "react-router";
import { LoaderDataEmails, loaderEmails } from "~/modules/emails/loaders/inbound-emails";
import InboundEmailsRoute from "~/modules/emails/routes/InboundEmailsRoute";
import { actionInboundEmails } from "~/modules/emails/actions/inbound-emails";
import { getTenantIdFromUrl } from "~/utils/services/.server/urlService";
import { v2MetaFunction } from "~/utils/compat/v2MetaFunction";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const tenantId = await getTenantIdFromUrl(params);
  return Response.json(await loaderEmails(request, params, tenantId));
};

export const action: ActionFunction = async ({ request, params }) => {
  const tenantId = await getTenantIdFromUrl(params);
  return await actionInboundEmails(request, params, tenantId);
};

export const meta: v2MetaFunction<LoaderDataEmails> = ({ data }) => [{ title: data?.title }];

export default InboundEmailsRoute;
