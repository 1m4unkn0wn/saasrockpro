// @@@ pwned by 1m4unkn0wn @@@
import SendersListRoute from "~/modules/emailMarketing/components/senders/SendersListRoute";
import { ActionFunction, LoaderFunctionArgs } from "react-router";
import { Senders_List } from "~/modules/emailMarketing/routes/Senders_List";

export const loader = (args: LoaderFunctionArgs) => Senders_List.loader(args);
export const action: ActionFunction = (args) => Senders_List.action(args);

export default () => <SendersListRoute />;
