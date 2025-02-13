// @@@ pwned by 1m4unkn0wn @@@
import { RowsListBlockDto } from "./RowsListBlockUtils";
import RowsListVariantTable from "./RowsListVariantTable";

export default function RowsListBlock({ item }: { item: RowsListBlockDto }) {
  return <>{item.style === "table" && <RowsListVariantTable item={item} />}</>;
}
