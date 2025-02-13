// @@@ pwned by 1m4unkn0wn @@@
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import ServerError from "~/components/ui/errors/ServerError";
import { BlogRoutesIndexApi } from "~/modules/blog/routes/api/BlogRoutes.Index.Api";
import BlogView from "~/modules/blog/routes/views/BlogRoutes.Index.View";

export const meta: MetaFunction<typeof loader> = ({ data }) => data?.metatags || [];
export const loader = (args: LoaderFunctionArgs) => BlogRoutesIndexApi.loader(args);
// export const action = (args: ActionFunctionArgs) => BlogRoutesIndexApi.action(args);

export default () => <BlogView />;

export function ErrorBoundary() {
  return <ServerError />;
}
