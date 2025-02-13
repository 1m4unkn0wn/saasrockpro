// @@@ pwned by 1m4unkn0wn @@@
import { Decimal } from "decimal.js";

export type RowValueRangeDto = {
  numberMin: Decimal | number | null;
  numberMax: Decimal | number | null;
  dateMin: Date | null;
  dateMax: Date | null;
};
