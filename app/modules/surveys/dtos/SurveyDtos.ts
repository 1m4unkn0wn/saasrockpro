// @@@ pwned by 1m4unkn0wn @@@
export type SurveyDto = {
  id: string;
  createdAt: Date;
  title: string;
  slug: string;
  description?: string | null;
  image: string | null;
  isEnabled: boolean;
  isPublic: boolean;
  items: SurveyItemDto[];
  results?: SurveyResultsDto;
  minSubmissions: number;
};

export type SurveyItemDto = {
  title: string;
  description?: string;
  type: "single-select" | "multi-select";
  order?: number;
  categories?: string[];
  href?: string;
  color: SurveyColor;
  options: {
    title: string;
    // link?: string;
    isOther?: boolean;
    icon?: string;
    shortName?: string;
  }[];
  style?: "default" | "grid";
};

export type SurveryItemResultDto = {
  item: string; // What SaasRock Edition are you using?
  values: string[]; // ["Core"]
  other?: string;
};

export type SurveyResultsDto = {
  totalVotes: number;
  items: {
    item: string;
    votes: { option: string; count: number; percentage: number }[];
  }[];
};

type SurveyColor =
  | "slate"
  | "gray"
  | "zinc"
  | "neutral"
  | "stone"
  | "red"
  | "orange"
  | "amber"
  | "yellow"
  | "lime"
  | "green"
  | "emerald"
  | "teal"
  | "cyan"
  | "sky"
  | "blue"
  | "indigo"
  | "violet"
  | "purple"
  | "fuchsia"
  | "pink"
  | "rose";
