// @@@ pwned by 1m4unkn0wn @@@
import { StatChange } from "./StatChange";

export type Stat = {
  name: string;
  hint: string;
  stat: string;
  previousStat?: string;
  change?: string;
  changeType?: StatChange;
  path?: string;
  entity?: {
    slug: string;
  };
};
