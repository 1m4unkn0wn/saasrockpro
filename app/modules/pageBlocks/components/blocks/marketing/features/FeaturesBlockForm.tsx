// @@@ pwned by 1m4unkn0wn @@@
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FeaturesBlockDto, FeaturesBlockStyle, FeaturesBlockStyles } from "~/modules/pageBlocks/components/blocks/marketing/features/FeaturesBlockUtils";
import ButtonTertiary from "~/components/ui/buttons/ButtonTertiary";
import InputGroup from "~/components/ui/forms/InputGroup";
import InputRadioGroup from "~/components/ui/input/InputRadioGroup";
import InputText from "~/components/ui/input/InputText";
import CollapsibleRow from "~/components/ui/tables/CollapsibleRow";
import PageBlockUtils from "~/modules/pageBlocks/components/blocks/PageBlockUtils";
import GridBlockForm from "../../shared/grid/GridBlockForm";

export default function FeaturesBlockForm({ item, onUpdate }: { item?: FeaturesBlockDto; onUpdate: (item: FeaturesBlockDto) => void }) {
  const { t } = useTranslation();
  const [state, setState] = useState<FeaturesBlockDto>(item || PageBlockUtils.defaultBlocks.features!);
  useEffect(() => {
    onUpdate(state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
  return (
    <div className="space-y-4">
      <InputGroup title="Design">
        <InputRadioGroup
          title="Style"
          value={state.style}
          setValue={(value) => setState({ ...state, style: value as FeaturesBlockStyle })}
          options={FeaturesBlockStyles.map((f) => f)}
        />
      </InputGroup>
      <InputGroup title="Copy">
        <div className="space-y-2">
          <InputText title="Top text" type="text" value={state.topText} setValue={(e) => setState({ ...state, topText: e.toString() })} />
          <InputText title="Headline" type="text" value={state.headline} setValue={(e) => setState({ ...state, headline: e.toString() })} />
          <InputText title="Subheadline" type="text" value={state.subheadline} setValue={(e) => setState({ ...state, subheadline: e.toString() })} />
          <GridBlockForm item={state.grid} onUpdate={(grid) => setState({ ...state, grid })} />
        </div>
      </InputGroup>

      <InputGroup title="Features">
        <div className="flex flex-col space-y-2">
          {state.items.map((item, index) => (
            <CollapsibleRow
              key={index}
              title={item.name}
              value={item.name}
              initial={!item.description}
              onRemove={() => {
                const items = state.items ?? [];
                items.splice(index, 1);
                setState({ ...state, items });
              }}
            >
              <div className="grid grid-cols-2 gap-2">
                <InputText
                  className="col-span-2"
                  title="Name"
                  type="text"
                  value={item.name}
                  setValue={(e) => setState({ ...state, items: state.items.map((item, i) => (i === index ? { ...item, name: e.toString() } : item)) })}
                />
                <InputText
                  className="col-span-2"
                  title="Description"
                  type="text"
                  value={item.description}
                  setValue={(e) => setState({ ...state, items: state.items.map((item, i) => (i === index ? { ...item, description: e.toString() } : item)) })}
                />
                <InputText
                  className="col-span-2"
                  title="Image (URL or SVG)"
                  type="text"
                  value={item.img}
                  setValue={(e) => setState({ ...state, items: state.items.map((item, i) => (i === index ? { ...item, img: e.toString() } : item)) })}
                />
                <InputText
                  title="Link text"
                  type="text"
                  value={item.link?.text}
                  setValue={(e) =>
                    setState({
                      ...state,
                      items: state.items.map((item, i) => (i === index ? { ...item, link: { href: item.link?.href ?? "", text: e.toString() ?? "" } } : item)),
                    })
                  }
                />
                <InputText
                  title="Link href"
                  type="text"
                  value={item.link?.href}
                  setValue={(e) =>
                    setState({
                      ...state,
                      items: state.items.map((item, i) => (i === index ? { ...item, link: { text: item.link?.text ?? "", href: e.toString() ?? "" } } : item)),
                    })
                  }
                />
              </div>
            </CollapsibleRow>
          ))}
          <ButtonTertiary
            onClick={() =>
              setState({
                ...state,
                items: [
                  ...(state.items ?? []),
                  {
                    name: "Feature " + (state.items.length + 1),
                    description: "",
                  },
                ],
              })
            }
          >
            {t("shared.add")}
          </ButtonTertiary>
        </div>
      </InputGroup>
    </div>
  );
}
