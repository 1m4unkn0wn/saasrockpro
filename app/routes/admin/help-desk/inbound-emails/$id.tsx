// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunction, LoaderFunctionArgs } from "react-router";
import { actionInboundEmailEdit } from "~/modules/emails/actions/inbound-email-edit";
import { loaderEmailEdit } from "~/modules/emails/loaders/inbound-email-edit";
import InboundEmailRoute from "~/modules/emails/routes/InboundEmailEditRoute";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  return Response.json(await loaderEmailEdit(request, params, null, "/admin/help-desk/inbound-emails"));
};

export const action: ActionFunction = async ({ request, params }) => {
  return await actionInboundEmailEdit(request, params, "/admin/help-desk/inbound-emails");
};

export default InboundEmailRoute;
