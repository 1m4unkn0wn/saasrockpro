// @@@ pwned by 1m4unkn0wn @@@
import { InboundEmailDto } from "./InboundEmailDto";

export type InboundEmailDetailsDto = InboundEmailDto & {
  TextBody: string;
  HtmlBody: string;
};
