// @@@ pwned by 1m4unkn0wn @@@
import { useEffect, useState } from "react";
import {
  NewsletterBlockDto,
  NewsletterBlockStyle,
  NewsletterBlockStyles,
} from "~/modules/pageBlocks/components/blocks/marketing/newsletter/NewsletterBlockUtils";
import InputGroup from "~/components/ui/forms/InputGroup";
import InputRadioGroup from "~/components/ui/input/InputRadioGroup";
import InputText from "~/components/ui/input/InputText";
import PageBlockUtils from "~/modules/pageBlocks/components/blocks/PageBlockUtils";
import SocialsBlockForm from "../../shared/socials/SocialsBlockForm";

export default function NewsletterBlockForm({ item, onUpdate }: { item?: NewsletterBlockDto; onUpdate: (item: NewsletterBlockDto) => void }) {
  const [state, setState] = useState<NewsletterBlockDto>(item || PageBlockUtils.defaultBlocks.newsletter!);
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
          setValue={(value) => setState({ ...state, style: value as NewsletterBlockStyle })}
          options={NewsletterBlockStyles.map((f) => f)}
        />
      </InputGroup>
      <InputGroup title="Copy">
        <div className="space-y-2">
          <InputText title="Headline" type="text" value={state.headline} setValue={(e) => setState({ ...state, headline: e.toString() })} />
          <InputText title="Subheadline" type="text" value={state.subheadline} setValue={(e) => setState({ ...state, subheadline: e.toString() })} />
        </div>
      </InputGroup>

      <InputGroup title="Socials">
        <SocialsBlockForm item={item?.socials} onUpdate={(socials) => setState({ ...state, socials })} />
      </InputGroup>
    </div>
  );
}
