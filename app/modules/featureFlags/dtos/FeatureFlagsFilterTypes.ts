// @@@ pwned by 1m4unkn0wn @@@
export const FeatureFlagsFilterTypes = [
  "env",
  "percentage",
  "session.darkMode",
  "session.language",
  "session.logged",
  "page.startsWith",
  "analytics.via",
  "analytics.httpReferrer",
  "analytics.browser",
  "analytics.os",
  "analytics.source",
  "analytics.medium",
  "analytics.campaign",
  "analytics.countryCode",
  "analytics.city",
  "user.createdAfter",
  "user.createdBefore",
  "user.is",
  "user.language",
  "user.roles.contains",
  "user.roles.notContains",
  "tenant.is",
  "tenant.subscription.products.has",
  "tenant.subscription.active",
  "tenant.subscription.inactive",
  "tenant.api.used",
] as const;
export type FeatureFlagsFilterType = (typeof FeatureFlagsFilterTypes)[number];
