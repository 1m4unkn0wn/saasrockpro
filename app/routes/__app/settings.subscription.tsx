// @@@ pwned by 1m4unkn0wn @@@
import { useEffect } from "react";
import { ActionFunction, LoaderFunctionArgs, MetaFunction, redirect, useLoaderData } from "react-router";
import { useActionData } from "react-router";
import { getAllSubscriptionProducts } from "~/utils/db/subscriptionProducts.db.server";
import {
  createCustomerPortalSession,
  createStripeSetupSession,
  deleteStripePaymentMethod,
  getStripeCustomer,
  getStripeInvoices,
  getStripePaymentIntents,
  getStripePaymentMethods,
  getStripeUpcomingInvoices,
} from "~/utils/stripe.server";
import { getUserInfo } from "~/utils/session.server";
import { getUser } from "~/utils/db/users.db.server";
import { loadDashboardData } from "~/utils/data/useDashboardData";
import { getTranslations } from "~/locale/i18next.server";
import { getOrPersistTenantSubscription, getTenantSubscription, TenantSubscriptionWithDetails } from "~/utils/db/tenantSubscriptions.db.server";
import { getMyTenants, TenantSimple } from "~/utils/db/tenants.db.server";
import { cancelTenantSubscription, getActiveTenantSubscriptions, getPlanFeaturesUsage } from "~/utils/services/.server/subscriptionService";
import { serverTimingHeaders } from "~/modules/metrics/utils/defaultHeaders.server";
import { promiseHash } from "~/utils/promises/promiseHash";
import { createMetrics } from "~/modules/metrics/services/.server/MetricTracker";
import SubscriptionSettings from "~/modules/users/components/SubscriptionSettings";
import toast from "react-hot-toast";
import FooterBlock from "~/modules/pageBlocks/components/blocks/marketing/footer/FooterBlock";
import HeaderBlock from "~/modules/pageBlocks/components/blocks/marketing/header/HeaderBlock";
import Tabs from "~/components/ui/tabs/Tabs";
import Stripe from "stripe";
import { PlanFeatureUsageDto } from "~/application/dtos/subscriptions/PlanFeatureUsageDto";
import { getAppConfiguration } from "~/utils/db/appConfiguration.db.server";
export { serverTimingHeaders as headers };

export const meta: MetaFunction<typeof loader> = ({ data }) => [{ title: data?.title }];

type LoaderData = {
  title: string;
  currentTenant: TenantSimple;
  mySubscription: TenantSubscriptionWithDetails | null;
  products: Awaited<ReturnType<typeof getAllSubscriptionProducts>>;
  customer: Stripe.Customer | Stripe.DeletedCustomer | null;
  myInvoices: Stripe.Invoice[];
  myPayments: Stripe.PaymentIntent[];
  myFeatures: PlanFeatureUsageDto[];
  myUpcomingInvoices: Stripe.UpcomingInvoice[];
  myPaymentMethods: Stripe.PaymentMethod[];
};
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  let { t } = await getTranslations(request);

  const userInfo = await getUserInfo(request);
  const user = await getUser(userInfo.userId);
  if (!user) {
    throw redirect("/login");
  }
  const appConfiguration = await getAppConfiguration({ request });
  if (appConfiguration.app.features.tenantHome !== "/") {
    throw redirect("/my-subscription");
  }
  const myTenants = await getMyTenants(userInfo.userId);
  if (myTenants.length === 0) {
    throw redirect("/settings/profile");
  }
  const currentTenant = myTenants[0];
  const tenantId = currentTenant.id;

  const tenantSubscription = await getOrPersistTenantSubscription(tenantId);
  // if (tenantSubscription.products.length === 0) {
  //   await autosubscribeToTrialOrFreePlan({ request, t, tenantId: tenantId, userId: userInfo.userId });
  // }
  const { mySubscription, customer, myInvoices, myPayments, myUpcomingInvoices, myPaymentMethods, myFeatures, dashboardData, products } = await promiseHash({
    mySubscription: getActiveTenantSubscriptions(tenantId),
    customer: getStripeCustomer(tenantSubscription.stripeCustomerId),
    myInvoices: getStripeInvoices(tenantSubscription.stripeCustomerId) ?? [],
    myPayments: getStripePaymentIntents(tenantSubscription.stripeCustomerId, "succeeded") ?? [],
    myUpcomingInvoices: getStripeUpcomingInvoices(tenantSubscription.products.filter((f) => f.stripeSubscriptionId).flatMap((p) => p.stripeSubscriptionId!)),
    myPaymentMethods: getStripePaymentMethods(tenantSubscription.stripeCustomerId),
    myFeatures: getPlanFeaturesUsage(tenantId),
    dashboardData: loadDashboardData({ request, params }),
    products: getAllSubscriptionProducts(true),
  });
  const data: LoaderData = {
    title: `${t("app.navbar.subscription")} | ${process.env.APP_NAME}`,
    currentTenant,
    mySubscription,
    customer,
    products,
    myFeatures,
    myInvoices,
    myPayments,
    myUpcomingInvoices,
    myPaymentMethods,
    ...dashboardData,
  };
  return data;
};

type ActionData = {
  error?: string;
  success?: string;
};
const badRequest = (data: ActionData) => Response.json(data, { status: 400 });
export const action: ActionFunction = async ({ request, params }) => {
  const { t } = await getTranslations(request);
  const userInfo = await getUserInfo(request);

  const user = await getUser(userInfo.userId);
  if (!user) {
    return badRequest({ error: "Invalid user" });
  }
  const myTenants = await getMyTenants(userInfo.userId);
  if (myTenants.length === 0) {
    return redirect("/settings/profile");
  }
  const tenantId = myTenants[0].id;

  const tenantSubscription = await getTenantSubscription(tenantId);
  const form = await request.formData();

  const action = form.get("action")?.toString();

  if (!tenantSubscription || !tenantSubscription?.stripeCustomerId) {
    return badRequest({
      error: "Invalid stripe customer",
    });
  } else if (action === "cancel") {
    const tenantSubscriptionProductId = form.get("tenant-subscription-product-id")?.toString() ?? "";
    try {
      await cancelTenantSubscription(tenantSubscriptionProductId, { t, tenantId, userId: userInfo.userId });
      return Response.json({ success: "Successfully cancelled" });
    } catch (e: any) {
      return Response.json({ error: e.message }, { status: 400 });
    }
  } else if (action === "add-payment-method") {
    const session = await createStripeSetupSession(request, tenantSubscription.stripeCustomerId);
    return redirect(session?.url ?? "");
  } else if (action === "delete-payment-method") {
    await deleteStripePaymentMethod(form.get("id")?.toString() ?? "");
    return Response.json({});
  } else if (action === "open-customer-portal") {
    const session = await createCustomerPortalSession(request, tenantSubscription.stripeCustomerId);
    return redirect(session?.url ?? "");
  }
};

export default function SubscriptionRoute() {
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();

  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData.error);
    } else if (actionData?.success) {
      toast.success(actionData.success);
    }
  }, [actionData]);

  return (
    <div>
      <HeaderBlock />
      <div className="mx-auto max-w-5xl space-y-5 px-4">
        <div className="border-b border-gray-200 pb-5">
          {/* <h3 className="text-xl font-semibold leading-6 text-gray-900">Settings</h3> */}
          <Tabs
            tabs={[
              { name: `Profile`, routePath: "/settings" },
              { name: `Subscription`, routePath: "/settings/subscription" },
            ]}
            exact
          />
        </div>
        <SubscriptionSettings {...data} permissions={{ viewInvoices: true }} />
      </div>
      <FooterBlock />
    </div>
  );
}
