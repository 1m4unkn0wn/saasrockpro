// @@@ pwned by 1m4unkn0wn @@@
const includePortalUserSubscriptionProductDetails = {
  subscriptionProduct: { include: { features: true } },
  prices: { include: { subscriptionPrice: true } },
};

export default {
  includePortalUserSubscriptionProductDetails,
};
