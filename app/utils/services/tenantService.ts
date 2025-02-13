// @@@ pwned by 1m4unkn0wn @@@
import UrlUtils from "../app/UrlUtils";
import { db } from "../db.server";
import { deleteTenant } from "../db/tenants.db.server";
import { getTenantSubscription } from "../db/tenantSubscriptions.db.server";
import { deleteStripeCustomer } from "../stripe.server";
import { TFunction } from "i18next";
import { cancelTenantSubscription } from "./.server/subscriptionService";

export async function deleteAndCancelTenant({ tenantId, userId, t }: { tenantId: string; userId: string; t?: TFunction }) {
  const tenantSubscription = await getTenantSubscription(tenantId);
  await cancelAllTenantPlans({ t, tenantId, userId });
  if (tenantSubscription?.stripeCustomerId) {
    await deleteStripeCustomer(tenantSubscription?.stripeCustomerId);
  }
  return await deleteTenant(tenantId);
}

export async function cancelAllTenantPlans({ tenantId, userId, t }: { tenantId: string; userId: string; t?: TFunction }) {
  const tenantSubscription = await getTenantSubscription(tenantId);
  if (tenantSubscription?.products) {
    await Promise.all(
      tenantSubscription.products.map(async (tenantSubscriptionProduct) => {
        await cancelTenantSubscription(tenantSubscriptionProduct.id, {
          tenantId,
          userId,
          t,
        });
      })
    );
  }
}

export async function getAvailableTenantSlug({ name, slug }: { name: string; slug?: string }) {
  if (slug === undefined) {
    slug = UrlUtils.slugify(name);
  }
  let tries = 1;
  do {
    const existingSlug = await getExistingSlug(slug);
    if (existingSlug) {
      slug = UrlUtils.slugify(name) + tries.toString();
      tries++;
    } else {
      break;
    }
  } while (true);
  return slug;
}

export async function getExistingSlug(slug: string) {
  if (["new-account", "undefined", "null"].includes(slug)) {
    return true;
  }
  const existing = await db.tenant.count({
    where: {
      slug,
    },
  });
  return existing > 0;
}
