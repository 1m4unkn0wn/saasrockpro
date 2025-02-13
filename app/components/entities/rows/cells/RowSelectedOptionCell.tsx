// @@@ pwned by 1m4unkn0wn @@@
import { Colors } from "~/application/enums/shared/Colors";
import RenderOption from "../../properties/select/RenderOption";
import { SelectOptionsDisplay } from "~/utils/shared/SelectOptionsUtils";

type ItemDto = { value: string; name: string | null; color: Colors };
export default function RowSelectedOptionCell({ value, options, display = "Name" }: { value: string; options: ItemDto[]; display: SelectOptionsDisplay }) {
  const selected = options.find((f) => f.value === value);
  if (options.length === 0 || !selected) {
    return value;
  }
  return (
    <>
      <div className="flex items-center space-x-2">
        <RenderOption option={selected} display={display} hasColors={true} />
      </div>
    </>
  );
}
