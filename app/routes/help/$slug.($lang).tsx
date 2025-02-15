// @@@ pwned by 1m4unkn0wn @@@
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import KbRoutesIndex from "~/modules/knowledgeBase/routes/views/KbRoutes.Index.View";
import { KbRoutesIndexApi } from "~/modules/knowledgeBase/routes/api/KbRoutes.Index.Api";
import ServerError from "~/components/ui/errors/ServerError";

export const meta: MetaFunction<typeof loader> = ({ data }) => data?.metatags || [];
export const loader = (args: LoaderFunctionArgs) => KbRoutesIndexApi.loader(args);
// export const action = (args: ActionFunctionArgs) => KbRoutesIndexApi.action(args);

export default () => <KbRoutesIndex />;

export function ErrorBoundary() {
  return <ServerError />;
}
