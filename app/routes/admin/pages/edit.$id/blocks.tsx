// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunction, LoaderFunctionArgs } from "react-router";
import PageBlocksRouteIndex from "~/modules/pageBlocks/components/pages/PageBlocksRouteIndex";
import { PageBlocks_Index } from "~/modules/pageBlocks/routes/pages/PageBlocks_Index";

export const loader = (args: LoaderFunctionArgs) => PageBlocks_Index.loader(args);
export const action: ActionFunction = (args) => PageBlocks_Index.action(args);

export default () => <PageBlocksRouteIndex />;
