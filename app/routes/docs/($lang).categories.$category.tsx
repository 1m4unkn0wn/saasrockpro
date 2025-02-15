// @@@ pwned by 1m4unkn0wn @@@
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import ServerError from "~/components/ui/errors/ServerError";
import { KbRoutesCategoryApi } from "~/modules/knowledgeBase/routes/api/KbRoutes.Category.Api";
import KbRoutesCategoryView from "~/modules/knowledgeBase/routes/views/KbRoutes.Category.View";

export const meta: MetaFunction<typeof loader> = ({ data }) => data?.metatags || [];
export const loader = (args: LoaderFunctionArgs) => KbRoutesCategoryApi.loader(args, { kbSlug: "docs" });
// export const action = (args: ActionFunctionArgs) => KbRoutesCategoryApi.action(args, { kbSlug: kbSlug: "docs",});

export default () => <KbRoutesCategoryView />;

export function ErrorBoundary() {
  return <ServerError />;
}
