// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunction, LoaderFunctionArgs, useActionData, useLoaderData } from "react-router";
import RowOverviewRoute from "~/modules/rows/components/RowOverviewRoute";
import ServerError from "~/components/ui/errors/ServerError";
import { Rows_Overview } from "~/modules/rows/routes/Rows_Overview.server";
import { serverTimingHeaders } from "~/modules/metrics/utils/defaultHeaders.server";
import { v2MetaFunction } from "~/utils/compat/v2MetaFunction";
export { serverTimingHeaders as headers };

export const meta: v2MetaFunction<Rows_Overview.LoaderData> = ({ data }) => data?.meta || [];
export const loader = (args: LoaderFunctionArgs) => Rows_Overview.loader(args);
export const action: ActionFunction = (args) => Rows_Overview.action(args);

export default function () {
  const data = useLoaderData<Rows_Overview.LoaderData>();
  const actionData = useActionData<Rows_Overview.ActionData>();
  return (
    <RowOverviewRoute
      rowData={data.rowData}
      item={actionData?.updatedRow?.item ?? data.rowData.item}
      routes={data.routes}
      relationshipRows={data.relationshipRows}
    />
  );
}

export function ErrorBoundary() {
  return <ServerError />;
}
