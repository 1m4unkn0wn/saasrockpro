// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunction, LoaderFunctionArgs } from "react-router";
import CampaignsNewRoute from "~/modules/emailMarketing/components/campaigns/CampaignsNewRoute";
import { Campaigns_New } from "~/modules/emailMarketing/routes/Campaigns_New";

export const loader = (args: LoaderFunctionArgs) => Campaigns_New.loader(args);
export const action: ActionFunction = (args) => Campaigns_New.action(args);

export default () => <CampaignsNewRoute />;
