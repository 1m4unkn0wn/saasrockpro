// @@@ pwned by 1m4unkn0wn @@@
import { useLoaderData } from "react-router";
import { Rows_Tags } from "../routes/Rows_Tags.server";
import RowSettingsTags from "~/components/entities/rows/RowSettingsTags";

export default function RowTagsRoute() {
  const data = useLoaderData<Rows_Tags.LoaderData>();
  return <RowSettingsTags item={data.rowData.item} tags={data.tags} />;
}
