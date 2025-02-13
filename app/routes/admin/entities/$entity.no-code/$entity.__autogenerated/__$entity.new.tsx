// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunction, LoaderFunctionArgs } from "react-router";
import ServerError from "~/components/ui/errors/ServerError";
import RowNewRoute from "~/modules/rows/components/RowNewRoute";
import { Rows_New } from "~/modules/rows/routes/Rows_New.server";
import { serverTimingHeaders } from "~/modules/metrics/utils/defaultHeaders.server";
import { v2MetaFunction } from "~/utils/compat/v2MetaFunction";
export { serverTimingHeaders as headers };

export const meta: v2MetaFunction<Rows_New.LoaderData> = ({ data }) => data?.meta || [];
export const loader = (args: LoaderFunctionArgs) => Rows_New.loader(args);
export const action: ActionFunction = (args) => Rows_New.action(args);

export default () => <RowNewRoute />;

export function ErrorBoundary() {
  return <ServerError />;
}
