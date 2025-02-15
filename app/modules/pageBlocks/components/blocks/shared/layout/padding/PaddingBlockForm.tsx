// @@@ pwned by 1m4unkn0wn @@@
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import InputSelector from "~/components/ui/input/InputSelector";
import { PaddingBlockDto, paddingX, paddingY } from "./PaddingBlockUtils";

export default function PaddingBlockForm({ item, onUpdate }: { item?: PaddingBlockDto; onUpdate: (item: PaddingBlockDto) => void }) {
  const { t } = useTranslation();
  const [x, setX] = useState(item?.x);
  const [y, setY] = useState(item?.y);
  useEffect(() => {
    onUpdate({ x, y });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [x, y]);
  return (
    <div className="space-y-1">
      <label className="flex w-full justify-between space-x-2 text-xs font-medium text-gray-600">
        <div className=" flex items-center space-x-1">Padding</div>
        {(x || y) && (
          <button
            type="button"
            onClick={() => {
              setX(undefined);
              setY(undefined);
            }}
          >
            {t("shared.remove")}
          </button>
        )}
      </label>
      <div className="grid grid-cols-2 gap-2">
        <InputSelector
          withSearch={false}
          value={x}
          options={paddingX.map((e) => ({ name: e, value: e }))}
          setValue={(e) => setX(e as (typeof paddingX)[number])}
        />
        <InputSelector
          withSearch={false}
          value={y}
          options={paddingY.map((e) => ({ name: e, value: e }))}
          setValue={(e) => setY(e as (typeof paddingY)[number])}
        />
      </div>
    </div>
  );
}
