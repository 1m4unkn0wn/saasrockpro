// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunction, LoaderFunctionArgs } from "react-router";
import ServerError from "~/components/ui/errors/ServerError";
import RowEditRoute from "~/modules/rows/components/RowEditRoute";
import { Rows_Edit } from "~/modules/rows/routes/Rows_Edit.server";
import { serverTimingHeaders } from "~/modules/metrics/utils/defaultHeaders.server";
import { v2MetaFunction } from "~/utils/compat/v2MetaFunction";
export { serverTimingHeaders as headers };

export const meta: v2MetaFunction<Rows_Edit.LoaderData> = ({ data }) => data?.meta || [];
export const loader = (args: LoaderFunctionArgs) => Rows_Edit.loader(args);
export const action: ActionFunction = (args) => Rows_Edit.action(args);

export default () => <RowEditRoute />;

export function ErrorBoundary() {
  return <ServerError />;
}
