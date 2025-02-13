// @@@ pwned by 1m4unkn0wn @@@
export const DefaultPermissions = [
  "admin.dashboard.view",
  "admin.accounts.view",
  "admin.accounts.create",
  "admin.account.view",
  "admin.account.settings.update",
  "admin.account.users",
  "admin.account.subscription",
  "admin.account.delete",
  "admin.accountTypes.view",
  "admin.accountTypes.create",
  "admin.accountTypes.update",
  "admin.accountTypes.delete",
  "admin.users.view",
  "admin.users.impersonate",
  "admin.users.changePassword",
  "admin.users.delete",
  "admin.relationships.view",
  "admin.relationships.create",
  "admin.relationships.update",
  "admin.relationships.delete",
  "admin.blacklist.view",
  "admin.tenantIpAddress.view",
  "admin.blacklist.manage",
  "admin.roles.view",
  "admin.roles.create",
  "admin.roles.update",
  "admin.roles.delete",
  "admin.roles.set",
  "admin.analytics.view",
  "admin.analytics.delete",
  "admin.blog.view",
  "admin.blog.create",
  "admin.blog.update",
  "admin.blog.delete",
  "admin.entities.view",
  "admin.entities.create",
  "admin.entities.update",
  "admin.entities.delete",
  // "admin.workflows.view",
  // "admin.workflows.create",
  // "admin.workflows.update",
  // "admin.workflows.delete",
  "admin.apiKeys.view",
  "admin.apiKeys.create",
  "admin.apiKeys.update",
  "admin.apiKeys.delete",
  "admin.auditTrails.view",
  "admin.events.view",
  "admin.pricing.view",
  "admin.pricing.create",
  "admin.pricing.update",
  "admin.pricing.delete",
  "admin.emails.view",
  "admin.emails.create",
  "admin.emails.update",
  "admin.emails.delete",
  "admin.pages.view",
  "admin.pages.create",
  "admin.pages.update",
  "admin.pages.delete",
  "admin.onboarding.view",
  "admin.onboarding.create",
  "admin.onboarding.update",
  "admin.onboarding.delete",
  "admin.notifications.view",
  "admin.featureFlags.view",
  "admin.featureFlags.manage",
  "admin.prompts.view",
  "admin.prompts.create",
  "admin.prompts.update",
  "admin.prompts.delete",
  "admin.formulas.view",
  "admin.formulas.create",
  "admin.formulas.update",
  "admin.formulas.delete",
  "admin.metrics.view",
  "admin.metrics.update",
  "admin.metrics.delete",
  "admin.kb.view",
  "admin.kb.create",
  "admin.kb.update",
  "admin.kb.delete",
  "admin.settings.cookies.view",
  "admin.settings.cookies.create",
  "admin.settings.cookies.update",
  "admin.settings.general.view",
  "admin.settings.general.update",
  "admin.settings.authentication.view",
  "admin.settings.authentication.update",
  "admin.settings.analytics.view",
  "admin.settings.analytics.update",
  "admin.settings.seo.update",
  "admin.settings.internationalization.view",
  "admin.settings.internationalization.update",
  "admin.settings.danger.reset",
  "admin.surveys",
  "app.dashboard.view",
  "app.settings.members.view",
  "app.settings.members.create",
  "app.settings.members.update",
  "app.settings.members.delete",
  "app.settings.members.impersonate",
  "app.settings.roles.view",
  "app.settings.roles.set",
  "app.settings.groups.full",
  "app.settings.subscription.view",
  "app.settings.subscription.update",
  "app.settings.subscription.delete",
  "app.settings.subscription.invoices.view",
  "app.settings.account.view",
  "app.settings.account.update",
  "app.settings.account.delete",
  "app.settings.accounts.view",
  "app.settings.accounts.create",
  "app.settings.accounts.update",
  "app.settings.accounts.delete",
  "app.settings.linkedAccounts.view",
  "app.settings.linkedAccounts.create",
  "app.settings.linkedAccounts.delete",
  "app.settings.apiKeys.view",
  "app.settings.apiKeys.create",
  "app.settings.apiKeys.update",
  "app.settings.apiKeys.delete",
  "app.settings.auditTrails.view",
  // "entity.{name}.view",
  // "entity.{name}.read",
  // "entity.{name}.create",
  // "entity.{name}.update",
  // "entity.{name}.delete",
] as const;
export type DefaultPermission = (typeof DefaultPermissions)[number];
