// @@@ pwned by 1m4unkn0wn @@@
import { useLoaderData } from "react-router";
import { Rows_Share } from "../routes/Rows_Share.server";
import RowSettingsPermissions from "~/components/entities/rows/RowSettingsPermissions";

export default function RowShareRoute() {
  const data = useLoaderData<Rows_Share.LoaderData>();
  return <RowSettingsPermissions item={data.rowData.item} items={data.rowData.item.permissions} tenants={data.tenants} users={data.users} withTitle={true} />;
}
