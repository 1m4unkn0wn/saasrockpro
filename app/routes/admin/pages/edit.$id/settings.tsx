// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunction, LoaderFunctionArgs } from "react-router";
import PageSettingsRouteIndex from "~/modules/pageBlocks/components/pages/PageSettingsRouteIndex";
import { PageSettings_Index } from "~/modules/pageBlocks/routes/pages/PageSettings_Index";

export const loader = (args: LoaderFunctionArgs) => PageSettings_Index.loader(args);
export const action: ActionFunction = (args) => PageSettings_Index.action(args);

export default () => <PageSettingsRouteIndex />;
