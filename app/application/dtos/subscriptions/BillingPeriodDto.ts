// @@@ pwned by 1m4unkn0wn @@@
import { SubscriptionBillingPeriod } from "~/application/enums/subscriptions/SubscriptionBillingPeriod";

export interface BillingPeriodDto {
  value: SubscriptionBillingPeriod;
  default?: boolean;
  disabled?: boolean;
  recurring: boolean;
}
