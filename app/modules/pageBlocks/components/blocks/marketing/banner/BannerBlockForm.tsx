// @@@ pwned by 1m4unkn0wn @@@
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BannerBlockDto, BannerBlockStyle, BannerBlockStyles } from "~/modules/pageBlocks/components/blocks/marketing/banner/BannerBlockUtils";
import ButtonTertiary from "~/components/ui/buttons/ButtonTertiary";
import InputGroup from "~/components/ui/forms/InputGroup";
import XIcon from "~/components/ui/icons/XIcon";
import InputRadioGroup from "~/components/ui/input/InputRadioGroup";
import InputText from "~/components/ui/input/InputText";
import PageBlockUtils from "~/modules/pageBlocks/components/blocks/PageBlockUtils";

export default function BannerBlockForm({ item, onUpdate }: { item?: BannerBlockDto; onUpdate: (item: BannerBlockDto) => void }) {
  const { t } = useTranslation();
  const [state, setState] = useState<BannerBlockDto>(item || PageBlockUtils.defaultBlocks.banner!);
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
          setValue={(value) => setState({ ...state, style: value as BannerBlockStyle })}
          options={BannerBlockStyles.map((f) => f)}
        />
      </InputGroup>
      <InputGroup title="Banner">
        <div className="space-y-2">
          <InputText title="Text" type="text" value={state.text} setValue={(e) => setState({ ...state, text: e.toString() })} />

          <div className="flex flex-col space-y-2">
            {state.cta.map((cta, index) => (
              <div key={index} className="group relative grid grid-cols-2 gap-2">
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
              </div>
            ))}
            <ButtonTertiary onClick={() => setState({ ...state, cta: [...state.cta, { text: "CTA", href: "#" }] })}>{t("shared.add")}</ButtonTertiary>
          </div>
        </div>
      </InputGroup>
    </div>
  );
}
