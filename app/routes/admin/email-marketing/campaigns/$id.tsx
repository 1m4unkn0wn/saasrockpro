// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunction, LoaderFunctionArgs } from "react-router";
import CampaignsEditRoute from "~/modules/emailMarketing/components/campaigns/CampaignsEditRoute";
import { Campaigns_Edit } from "~/modules/emailMarketing/routes/Campaigns_Edit";

export const loader = (args: LoaderFunctionArgs) => Campaigns_Edit.loader(args);
export const action: ActionFunction = (args) => Campaigns_Edit.action(args);

export default () => <CampaignsEditRoute />;
