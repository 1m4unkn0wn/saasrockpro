// @@@ pwned by 1m4unkn0wn @@@
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { HeroBlockDto, HeroBlockStyle, HeroBlockStyles } from "~/modules/pageBlocks/components/blocks/marketing/hero/HeroBlockUtils";
import ButtonTertiary from "~/components/ui/buttons/ButtonTertiary";
import InputGroup from "~/components/ui/forms/InputGroup";
import XIcon from "~/components/ui/icons/XIcon";
import InputCheckbox from "~/components/ui/input/InputCheckbox";
import InputResponsiveSelector from "~/components/ui/input/InputResponsiveSelector";
import InputText from "~/components/ui/input/InputText";
import PageBlockUtils from "~/modules/pageBlocks/components/blocks/PageBlockUtils";

export default function HeroBlockForm({ item, onUpdate }: { item?: HeroBlockDto; onUpdate: (item: HeroBlockDto) => void }) {
  const { t } = useTranslation();
  const [state, setState] = useState<HeroBlockDto>(item || PageBlockUtils.defaultBlocks.hero!);
  useEffect(() => {
    onUpdate(state);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
  return (
    <div className="space-y-4">
      <InputGroup title="Design">
        <InputResponsiveSelector
          title="Style"
          value={state.style}
          setValue={(value) => setState({ ...state, style: value as HeroBlockStyle })}
          options={HeroBlockStyles.map((f) => f)}
        />
      </InputGroup>
      <InputGroup title="Copy">
        <div className="space-y-2">
          <InputText title="Headline" type="text" value={state.headline} setValue={(e) => setState({ ...state, headline: e.toString() })} />
          <InputText title="Description" type="text" value={state.description} setValue={(e) => setState({ ...state, description: e.toString() })} />
          {["rightImage", "topImage", "bottomImage"].includes(state.style) && (
            <InputText title="Image" type="text" value={state.image} setValue={(e) => setState({ ...state, image: e.toString() })} />
          )}
          <div className="grid grid-cols-3 gap-2">
            <InputText
              title="Top text"
              type="text"
              value={state.topText?.text}
              setValue={(e) => setState({ ...state, topText: { ...state.topText, text: e.toString() } })}
            />
            <InputText
              title="Top link text"
              type="text"
              value={state.topText?.link?.text}
              setValue={(e) => setState({ ...state, topText: { ...state.topText, link: { ...state.topText?.link, text: e.toString() } } })}
            />
            <InputText
              title="Top link href"
              type="text"
              value={state.topText?.link?.href}
              setValue={(e) => setState({ ...state, topText: { ...state.topText, link: { ...state.topText?.link, href: e.toString() } } })}
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <InputText
              title="Bottom text"
              type="text"
              value={state.bottomText?.text}
              setValue={(e) => setState({ ...state, bottomText: { ...state.bottomText, text: e.toString() } })}
            />
            <InputText
              title="Bottom link text"
              type="text"
              value={state.bottomText?.link?.text}
              setValue={(e) => setState({ ...state, bottomText: { ...state.bottomText, link: { ...state.bottomText?.link, text: e.toString() } } })}
            />
            <InputText
              title="Bottom link href"
              type="text"
              value={state.bottomText?.link?.href}
              setValue={(e) => setState({ ...state, bottomText: { ...state.bottomText, link: { ...state.bottomText?.link, href: e.toString() } } })}
            />
          </div>
        </div>
      </InputGroup>
      <InputGroup title="CTA">
        <div className="flex flex-col space-y-2">
          {state.cta.map((cta, index) => (
            <div key={index} className="group relative grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  const cta = state.cta;
                  cta.splice(index, 1);
                  setState({ ...state, cta });
                }}
                type="button"
                className="absolute top-0 right-0 -mt-3 hidden origin-top-right justify-center rounded-full bg-white text-gray-600 hover:text-red-500 group-hover:flex"
              >
                <XIcon className="h-6 w-6" />
              </button>
              <InputText
                title="CTA text"
                type="text"
                value={cta.text}
                setValue={(e) => setState({ ...state, cta: state.cta.map((cta, i) => (i === index ? { ...cta, text: e.toString() } : cta)) })}
              />
              <InputText
                title="CTA link"
                type="text"
                value={cta.href}
                setValue={(e) => setState({ ...state, cta: state.cta.map((cta, i) => (i === index ? { ...cta, href: e.toString() } : cta)) })}
              />
              <InputCheckbox
                title="Is primary"
                value={cta.isPrimary}
                setValue={(e) => setState({ ...state, cta: state.cta.map((cta, i) => (i === index ? { ...cta, isPrimary: Boolean(e) } : cta)) })}
              />
            </div>
          ))}
          <ButtonTertiary onClick={() => setState({ ...state, cta: [...state.cta, { text: "CTA", href: "#", isPrimary: false }] })}>
            {t("shared.add")}
          </ButtonTertiary>
        </div>
      </InputGroup>
    </div>
  );
}
