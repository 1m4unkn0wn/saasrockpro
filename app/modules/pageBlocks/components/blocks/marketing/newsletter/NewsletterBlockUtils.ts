// @@@ pwned by 1m4unkn0wn @@@
import { SocialsBlockDto } from "~/modules/pageBlocks/components/blocks/shared/socials/SocialsBlockDto";
import { defaultSocials } from "~/modules/pageBlocks/utils/defaultSocials";

export type NewsletterBlockDto = {
  style: NewsletterBlockStyle;
  headline?: string;
  subheadline?: string;
  socials?: SocialsBlockDto;
  cta?: { text: string; href: string }[];
};

export const NewsletterBlockStyles = [
  { value: "simple", name: "Simple" },
  { value: "rightForm", name: "Right Form" },
] as const;
export type NewsletterBlockStyle = (typeof NewsletterBlockStyles)[number]["value"];

export const defaultNewsletterBlock: NewsletterBlockDto = {
  style: "simple",
  headline: "Newsletter Headline",
  subheadline: "Newsletter Subheadline",
  socials: defaultSocials,
};
