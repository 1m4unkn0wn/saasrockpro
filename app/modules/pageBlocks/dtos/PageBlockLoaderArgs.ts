// @@@ pwned by 1m4unkn0wn @@@
import { Params } from "react-router";
import { TFunction } from "i18next";
import { PageBlockDto } from "./PageBlockDto";

export interface PageBlockLoaderArgs {
  request: Request;
  params: Params;
  t: TFunction;
  block?: PageBlockDto;
}
