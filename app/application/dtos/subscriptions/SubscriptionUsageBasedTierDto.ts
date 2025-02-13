// @@@ pwned by 1m4unkn0wn @@@
import { Decimal } from "decimal.js";

export interface SubscriptionUsageBasedTierDto {
  id: string;
  subscriptionUsageBasedPriceId: string;
  from: number;
  to?: number | null;
  perUnitPrice?: number | Decimal | null;
  flatFeePrice?: number | Decimal | null;
}
