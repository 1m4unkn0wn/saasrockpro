// @@@ pwned by 1m4unkn0wn @@@
export const OnboardingFilterTypes = [
  "admin.portal",
  "user.is",
  "user.language",
  "user.firstName.notSet",
  "user.lastName.notSet",
  "user.avatar.notSet",
  "user.roles.contains",
  "user.roles.notContains",
  "tenant.portal",
  "tenant.is",
  "tenant.members.hasOne",
  "tenant.members.hasMany",
  "tenant.subscription.products.has",
  "tenant.subscription.active",
  "tenant.subscription.inactive",
  "tenant.api.used",
  "tenant.api.notUsed",
  "tenant.user.entity.hasCreated",
  "tenant.user.entity.hasNotCreated",
] as const;
export type OnboardingFilterType = (typeof OnboardingFilterTypes)[number];
