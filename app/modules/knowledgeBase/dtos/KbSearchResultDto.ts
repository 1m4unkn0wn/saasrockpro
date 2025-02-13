// @@@ pwned by 1m4unkn0wn @@@
import { type KbArticleDto } from "./KbArticleDto";

export type KbSearchResultDto = {
  query: string;
  articles: KbArticleDto[];
};
