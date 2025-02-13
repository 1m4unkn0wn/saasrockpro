// @@@ pwned by 1m4unkn0wn @@@
export type SubscriptionUsageBasedUnitDto = {
  unit: string;
  unitTitle: string;
  unitTitlePlural: string;
  usageType: string;
  aggregateUsage: string;
  tiersMode: string;
  billingScheme: string;
  tiers: { from: number; to?: number }[];
  prices: {
    currency: string;
    from: number;
    to: number | undefined;
    perUnitPrice?: number | undefined;
    flatFeePrice?: number | undefined;
  }[];
};
