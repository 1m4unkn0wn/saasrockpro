// @@@ pwned by 1m4unkn0wn @@@
import TrashIcon from "~/components/ui/icons/TrashIcon";
import { useTranslation } from "react-i18next";
import InputText from "~/components/ui/input/InputText";
import { SurveyItemDto } from "../dtos/SurveyDtos";
import InputSelect from "~/components/ui/input/InputSelect";
import InputMultipleText from "~/components/ui/input/InputMultipleText";
import InputCheckboxWithDescription from "~/components/ui/input/InputCheckboxWithDescription";
import SurveyItemOptionsList from "./SurveyItemOptionsList";
import CollapsibleRow from "~/components/ui/tables/CollapsibleRow";

interface Props {
  items: SurveyItemDto[];
  onChange: (items: SurveyItemDto[]) => void;
}
export default function SurveyItemsList({ items, onChange }: Props) {
  const { t } = useTranslation();
  return (
    <div className="space-y-2">
      {items.map((item, idx) => {
        return <input key={idx} type="hidden" name="items[]" value={JSON.stringify(item)} readOnly hidden />;
      })}

      <div className="space-y-2">
        {items.map((item, idx) => {
          return (
            <CollapsibleRow
              value={item.title || `Survey Item ${idx + 1}`}
              title={item.title || `Survey Item ${idx + 1}`}
              onRemove={() => {
                const newItems = [...items];
                newItems.splice(idx, 1);
                onChange(newItems);
              }}
              className="px-4"
            >
              <div key={idx} className="border-border mt-2 border-t pt-4">
                {/* <div className=" absolute right-0 top-0 -mr-2 -mt-2">
                  <button
                    type="button"
                    className=" border-border bg-background hover:bg-secondary group flex items-center rounded-md border p-2"
                    onClick={() => {
                      const newItems = [...items];
                      newItems.splice(idx, 1);
                      onChange(newItems);
                    }}
                  >
                    <TrashIcon className="h-4 w-4 text-gray-300 group-hover:text-gray-500" />
                  </button>
                </div> */}
                <div className=" grid grid-cols-12 gap-2">
                  <InputSelect
                    title={t("shared.type")}
                    value={item.type}
                    className="col-span-4"
                    setValue={(e) => onChange([...items.slice(0, idx), { ...item, type: e as any }, ...items.slice(idx + 1)])}
                    options={[
                      {
                        value: "single-select",
                        name: "Single Select",
                      },
                      {
                        value: "multi-select",
                        name: "Multiple Select",
                      },
                    ]}
                    // display="name"
                  />
                  <InputText
                    className="col-span-8"
                    title={"Title"}
                    value={item.title}
                    setValue={(e) => onChange([...items.slice(0, idx), { ...item, title: e?.toString() ?? "" }, ...items.slice(idx + 1)])}
                    required
                  />
                  <InputText
                    className="col-span-12"
                    title={"Description"}
                    value={item.description}
                    setValue={(e) => onChange([...items.slice(0, idx), { ...item, description: e?.toString() ?? "" }, ...items.slice(idx + 1)])}
                  />

                  <InputText
                    className="col-span-4"
                    title={"href"}
                    value={item.href}
                    setValue={(e) => onChange([...items.slice(0, idx), { ...item, href: e?.toString() ?? "" }, ...items.slice(idx + 1)])}
                  />
                  <InputSelect
                    className="col-span-4"
                    title={"Color"}
                    value={item.color}
                    setValue={(e) => onChange([...items.slice(0, idx), { ...item, color: e?.toString() ?? ("" as any) }, ...items.slice(idx + 1)])}
                    options={[
                      { name: "slate", value: "slate" },
                      { name: "gray", value: "gray" },
                      { name: "zinc", value: "zinc" },
                      { name: "neutral", value: "neutral" },
                      { name: "stone", value: "stone" },
                      { name: "red", value: "red" },
                      { name: "orange", value: "orange" },
                      { name: "amber", value: "amber" },
                      { name: "yellow", value: "yellow" },
                      { name: "lime", value: "lime" },
                      { name: "green", value: "green" },
                      { name: "emerald", value: "emerald" },
                      { name: "teal", value: "teal" },
                      { name: "cyan", value: "cyan" },
                      { name: "sky", value: "sky" },
                      { name: "blue", value: "blue" },
                      { name: "indigo", value: "indigo" },
                      { name: "violet", value: "violet" },
                      { name: "purple", value: "purple" },
                      { name: "fuchsia", value: "fuchsia" },
                      { name: "pink", value: "pink" },
                      { name: "rose", value: "rose" },
                    ]}
                  />
                  <InputSelect
                    title="Style"
                    value={item.style}
                    className="col-span-4"
                    setValue={(e) => onChange([...items.slice(0, idx), { ...item, style: e as any }, ...items.slice(idx + 1)])}
                    options={[
                      {
                        value: "default",
                        name: "Default",
                      },
                      {
                        value: "grid",
                        name: "Grid",
                      },
                    ]}
                    // display="name"
                  />

                  <div className="col-span-12 space-y-1">
                    <h3 className="text-xs font-medium leading-3">Options</h3>
                    <SurveyItemOptionsList
                      items={item.options}
                      onChange={(e) => onChange([...items.slice(0, idx), { ...item, options: e }, ...items.slice(idx + 1)])}
                    />
                  </div>
                  {/* <InputMultipleText
                  className="col-span-12"
                  name="categories[]"
                  title={"Categories"}
                  value={item.categories || []}
                  onChange={(e) => onChange([...items.slice(0, idx), { ...item, categories: e }, ...items.slice(idx + 1)])}
                  separator=","
                /> */}
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
                  style: "default",
                  title: "",
                  description: "",
                  type: "single-select",
                  categories: [],
                  color: "blue",
                  options: [{ title: "Option 1", icon: "" }],
                },
              ]);
            }}
            className="bg-background focus:ring-ring border-border hover:border-foreground hover:bg-secondary hover:text-secondary-foreground relative block w-full rounded-lg border-2 border-dashed px-12 py-3 text-center focus:outline-none focus:ring-2 focus:ring-offset-2"
          >
            <span className="mt-1 block text-xs font-medium">Add survey item</span>
          </button>
        </div>
      </div>
    </div>
  );
}
