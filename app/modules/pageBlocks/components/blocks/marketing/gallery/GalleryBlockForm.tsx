// @@@ pwned by 1m4unkn0wn @@@
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { GalleryBlockDto, GalleryBlockStyle, GalleryBlockStyles } from "~/modules/pageBlocks/components/blocks/marketing/gallery/GalleryBlockUtils";
import ButtonTertiary from "~/components/ui/buttons/ButtonTertiary";
import InputGroup from "~/components/ui/forms/InputGroup";
import InputRadioGroup from "~/components/ui/input/InputRadioGroup";
import InputText from "~/components/ui/input/InputText";
import CollapsibleRow from "~/components/ui/tables/CollapsibleRow";
import PageBlockUtils from "~/modules/pageBlocks/components/blocks/PageBlockUtils";

export default function GalleryBlockForm({ item, onUpdate }: { item?: GalleryBlockDto; onUpdate: (item: GalleryBlockDto) => void }) {
  const { t } = useTranslation();
  const [state, setState] = useState<GalleryBlockDto>(item || PageBlockUtils.defaultBlocks.gallery!);
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
          setValue={(value) => setState({ ...state, style: value as GalleryBlockStyle })}
          options={GalleryBlockStyles.map((f) => f)}
        />
      </InputGroup>
      <InputGroup title="Copy">
        <div className="space-y-2">
          <InputText title="Top text" type="text" value={state.topText} setValue={(e) => setState({ ...state, topText: e.toString() })} />
          <InputText title="Headline" type="text" value={state.headline} setValue={(e) => setState({ ...state, headline: e.toString() })} />
          <InputText title="Subheadline" type="text" value={state.subheadline} setValue={(e) => setState({ ...state, subheadline: e.toString() })} />
        </div>
      </InputGroup>

      <InputGroup title="Images">
        <div className="flex flex-col space-y-2">
          {state.items.map((item, index) => (
            <CollapsibleRow
              key={index}
              title={item.title}
              value={item.title}
              initial={!item.src}
              onRemove={() => {
                const items = state.items ?? [];
                items.splice(index, 1);
                setState({ ...state, items });
              }}
            >
              <div className="grid grid-cols-1 gap-2">
                <InputRadioGroup
                  title="Type"
                  value={item.type}
                  setValue={(e) =>
                    setState({ ...state, items: state.items.map((item, i) => (i === index ? { ...item, type: e?.toString() ?? "image" } : item)) })
                  }
                  options={[
                    {
                      name: "Image",
                      value: "image",
                    },
                    {
                      name: "Video",
                      value: "video",
                    },
                  ]}
                />
                <InputText
                  title="Title"
                  type="text"
                  value={item.title}
                  setValue={(e) => setState({ ...state, items: state.items.map((item, i) => (i === index ? { ...item, title: e.toString() } : item)) })}
                />
                <InputText
                  title="Src"
                  type="text"
                  value={item.src}
                  setValue={(e) => setState({ ...state, items: state.items.map((item, i) => (i === index ? { ...item, src: e.toString() } : item)) })}
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
                    type: "Image",
                    title: "Item " + state.items.length + 1,
                    src: "",
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
