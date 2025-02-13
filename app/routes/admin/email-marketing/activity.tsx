// @@@ pwned by 1m4unkn0wn @@@
import { LoaderFunctionArgs } from "react-router";
import OutboundEmailsListRoute from "~/modules/emailMarketing/components/outboundEmails/OutboundEmailsListRoute";
import { OutboundEmails_List } from "~/modules/emailMarketing/routes/OutboundEmails_List";

export const loader = (args: LoaderFunctionArgs) => OutboundEmails_List.loader(args);

export default () => <OutboundEmailsListRoute />;
