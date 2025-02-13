// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunction, LoaderFunctionArgs } from "react-router";
import ServerError from "~/components/ui/errors/ServerError";
import RowShareRoute from "~/modules/rows/components/RowShareRoute";
import { Rows_Share } from "~/modules/rows/routes/Rows_Share.server";
import { serverTimingHeaders } from "~/modules/metrics/utils/defaultHeaders.server";
import { v2MetaFunction } from "~/utils/compat/v2MetaFunction";
export { serverTimingHeaders as headers };

export const meta: v2MetaFunction<Rows_Share.LoaderData> = ({ data }) => data?.meta || [];
export const loader = (args: LoaderFunctionArgs) => Rows_Share.loader(args);
export const action: ActionFunction = (args) => Rows_Share.action(args);

export default () => <RowShareRoute />;

export function ErrorBoundary() {
  return <ServerError />;
}
