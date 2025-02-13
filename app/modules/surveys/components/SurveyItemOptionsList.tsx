// @@@ pwned by 1m4unkn0wn @@@
import TrashIcon from "~/components/ui/icons/TrashIcon";
import { useTranslation } from "react-i18next";
import InputText from "~/components/ui/input/InputText";
import { SurveyItemDto } from "../dtos/SurveyDtos";
import InputSelect from "~/components/ui/input/InputSelect";
import InputMultipleText from "~/components/ui/input/InputMultipleText";
import InputCheckboxWithDescription from "~/components/ui/input/InputCheckboxWithDescription";
import CollapsibleRow from "~/components/ui/tables/CollapsibleRow";

interface Props {
  items: SurveyItemDto["options"];
  onChange: (items: SurveyItemDto["options"]) => void;
}
export default function SurveyItemOptionsList({ items, onChange }: Props) {
  const { t } = useTranslation();
  return (
    <div className="space-y-2">
      <div className="space-y-2">
        {items.map((item, idx) => {
          return (
            <CollapsibleRow
              className="bg-secondary px-4"
              title={""}
              value={item.title || `Option ${idx + 1}`}
              onRemove={() => {
                const newItems = [...items];
                newItems.splice(idx, 1);
                onChange(newItems);
              }}
            >
              <div key={idx} className="">
                <div className=" grid grid-cols-12 gap-2">
                  <InputText
                    className="col-span-6"
                    title={"Title"}
                    value={item.title}
                    setValue={(e) => onChange([...items.slice(0, idx), { ...item, title: e?.toString() ?? "" }, ...items.slice(idx + 1)])}
                    required
                  />
                  <InputText
                    className="col-span-6"
                    title={"Short name"}
                    value={item.shortName}
                    help="Used in charts"
                    setValue={(e) => onChange([...items.slice(0, idx), { ...item, shortName: e?.toString() ?? "" }, ...items.slice(idx + 1)])}
                  />
                  <InputText
                    className="col-span-6"
                    title={"Icon"}
                    value={item.icon}
                    setValue={(e) => onChange([...items.slice(0, idx), { ...item, icon: e?.toString() ?? "" }, ...items.slice(idx + 1)])}
                  />
                  <InputCheckboxWithDescription
                    className="col-span-12"
                    name="isOther"
                    title="Custom Value"
                    description="User can enter a custom value"
                    value={item.isOther}
                    setValue={(e) => onChange([...items.slice(0, idx), { ...item, isOther: Boolean(e) }, ...items.slice(idx + 1)])}
                  />
                </div>
              </div>
            </CollapsibleRow>
          );
        })}

        <div>
          <button
            type="button"
            onClick={() => {
              onChange([
                ...items,
                {
                  title: "",
                  icon: "",
                  isOther: false,
                },
              ]);
            }}
            className="bg-background focus:ring-ring border-border hover:border-foreground hover:bg-secondary hover:text-secondary-foreground relative block w-full rounded-lg border-2 border-dashed px-12 py-3 text-center focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            <span className="mt-1 block text-xs font-medium">Add option</span>
          </button>
        </div>
      </div>
    </div>
  );
}
