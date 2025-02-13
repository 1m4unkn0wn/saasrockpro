// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunction, LoaderFunctionArgs } from "react-router";
import RowsImportRoute from "~/modules/rows/components/RowsImportRoute";
import { Rows_Import } from "~/modules/rows/routes/Rows_Import.server";
import { serverTimingHeaders } from "~/modules/metrics/utils/defaultHeaders.server";
import { v2MetaFunction } from "~/utils/compat/v2MetaFunction";
export { serverTimingHeaders as headers };

export const meta: v2MetaFunction<Rows_Import.LoaderData> = ({ data }) => data?.meta || [];
export const loader = (args: LoaderFunctionArgs) => Rows_Import.loader(args);
export const action: ActionFunction = (args) => Rows_Import.action(args);

export default () => <RowsImportRoute />;
