// @@@ pwned by 1m4unkn0wn @@@
const includeTenantSubscriptionProductDetails = {
  subscriptionProduct: { include: { features: true } },
  prices: { include: { subscriptionPrice: true, subscriptionUsageBasedPrice: { include: { tiers: true } } } },
};

export default {
  includeTenantSubscriptionProductDetails,
};
