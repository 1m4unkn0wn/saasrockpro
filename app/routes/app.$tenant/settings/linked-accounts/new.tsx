// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunction, LoaderFunctionArgs, MetaFunction, useLoaderData } from "react-router";
import { getTranslations } from "~/locale/i18next.server";
import { getUserInfo } from "~/utils/session.server";
import { getUser, getUserByEmail, UserSimple } from "~/utils/db/users.db.server";
import { getMyTenants, TenantSimple } from "~/utils/db/tenants.db.server";
import { sendEmail } from "~/utils/email.server";
import { loadAppData } from "~/utils/data/.server/appData";
import { getTenantIdFromUrl } from "~/utils/services/.server/urlService";
import { createLog } from "~/utils/db/logs.db.server";
import NewLinkedAccount from "~/components/app/linkedAccounts/NewLinkedAccount";
import { LinkedAccountStatus } from "~/application/enums/tenants/LinkedAccountStatus";
import { createLinkedAccount, getLinkedAccountByTenantIds, getLinkedAccountsCount } from "~/utils/db/linkedAccounts.db.server";
import { LinkedAccount } from "@prisma/client";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import { getBaseURL } from "~/utils/url.server";
import { getPlanFeatureUsage } from "~/utils/services/.server/subscriptionService";
import { DefaultFeatures } from "~/application/dtos/shared/DefaultFeatures";
import { PlanFeatureUsageDto } from "~/application/dtos/subscriptions/PlanFeatureUsageDto";
import { createMetrics } from "~/modules/metrics/services/.server/MetricTracker";
import { requireAuth } from "~/utils/loaders.middleware";

export const meta: MetaFunction<typeof loader> = ({ data }) => [{ title: data?.title }];

type LoaderData = {
  title: string;
  linksCount: number;
  featurePlanUsage: PlanFeatureUsageDto | undefined;
};
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await requireAuth({ request, params });
  let { t } = await getTranslations(request);
  const tenantId = await getTenantIdFromUrl(params);
  await verifyUserHasPermission(request, "app.settings.linkedAccounts.create", tenantId);

  const data: LoaderData = {
    title: `${t("app.linkedAccounts.actions.new")} | ${process.env.APP_NAME}`,
    linksCount: await getLinkedAccountsCount(tenantId, [LinkedAccountStatus.PENDING, LinkedAccountStatus.LINKED]),
    featurePlanUsage: await getPlanFeatureUsage(tenantId, DefaultFeatures.LinkedAccounts),
  };
  return data;
};

export type NewLinkedAccountActionData = {
  error?: string;
  success?: string;
  linkedAccount?: LinkedAccount;
  findUserAccounts?: {
    user: UserSimple;
    tenants: TenantSimple[];
  };
};
const badRequest = (data: NewLinkedAccountActionData) => Response.json(data, { status: 400 });
export const action: ActionFunction = async ({ request, params }) => {
  await requireAuth({ request, params });
  const { time, getServerTimingHeader } = await createMetrics({ request, params }, "app.$tenant.settings.linked-accounts.new");
  const { t } = await getTranslations(request);
  const tenantId = await getTenantIdFromUrl(params);

  const userInfo = await getUserInfo(request);
  const currentUser = await getUser(userInfo.userId);
  if (!currentUser) {
    return badRequest({ error: t("api.errors.userNotRegistered") });
  }

  const appData = await time(loadAppData({ request, params, t, time }), "loadAppData");

  const form = await request.formData();
  const action = form.get("action")?.toString();
  if (action === "get-accounts") {
    const email = form.get("email")?.toString().toLowerCase().trim() ?? "";
    const user = await getUserByEmail(email);
    if (!user) {
      return badRequest({ error: t("api.errors.userNotRegistered") });
    }
    const tenants = await getMyTenants(user.id);
    if (tenants.length === 0) {
      return badRequest({ error: t("app.linkedAccounts.invitation.inviteOwnersOrAdmins") });
    }
    const data: NewLinkedAccountActionData = {
      findUserAccounts: {
        user,
        tenants,
      },
    };
    return Response.json(data, { headers: getServerTimingHeader() });
  } else if (action === "invite") {
    const email = form.get("email")?.toString().toLowerCase().trim() ?? "";
    const selectedTenantId = form.get("selected-tenant-id")?.toString() ?? "";
    const inviteeIsProvider = Boolean(form.get("invitee-is-provider"));
    if (!email || !tenantId) {
      return badRequest({ error: t("shared.missingFields") });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return badRequest({ error: t("api.errors.userNotRegistered") });
    }
    if (user.id === userInfo.userId) {
      return badRequest({ error: t("app.linkedAccounts.invitation.cannotInviteSelf") });
    }

    const tenants = await getMyTenants(user.id);
    const tenant = tenants.find((f) => f.id === selectedTenantId);
    if (!tenant) {
      return badRequest({
        error: t("app.linkedAccounts.invitation.notFound", { 0: email }),
      });
    }
    if (tenant.id === tenantId) {
      return badRequest({ error: t("app.linkedAccounts.invitation.cannotInviteCurrentTenant") });
    }

    const providerTenantId = inviteeIsProvider ? tenant.id : tenantId;
    const clientTenantId = !inviteeIsProvider ? tenant.id : tenantId;
    const existing = await getLinkedAccountByTenantIds(providerTenantId, clientTenantId);
    if (existing) {
      return badRequest({ error: t("app.linkedAccounts.invitation.existing") });
    }

    const linkedAccount = await createLinkedAccount({
      createdByUserId: userInfo.userId,
      createdByTenantId: tenantId,
      providerTenantId,
      clientTenantId,
      status: LinkedAccountStatus.PENDING,
      // userInvitedId: user.id,
    });

    if (!linkedAccount) {
      return badRequest({ error: "Could not create link" });
    }

    await createLog(request, tenantId, "Created tenant relationship", `${tenant.name} ${inviteeIsProvider ? "as a provider" : "as a client"}`);

    try {
      await sendEmail({
        request,
        to: user.email,
        alias: "create-linked-account",
        data: {
          action_url: getBaseURL(request) + `/app/${tenant.slug}/settings/linked-accounts`,
          name: user.firstName,
          invite_sender_name: appData.user?.firstName,
          invite_sender_email: appData.user?.email,
          tenant_invitee: tenant.name,
          tenant_creator: appData.currentTenant?.name,
          invitation_role: inviteeIsProvider ? "as a provider" : "as a client",
        },
      });
    } catch (e) {
      return badRequest({ error: "Link created, but could not send email: " + e });
    }
    const data: NewLinkedAccountActionData = {
      linkedAccount,
      success: t("app.linkedAccounts.pending.invitationSentDescription", { 0: email }),
    };
    return Response.json(data, { headers: getServerTimingHeader() });
  } else {
    return badRequest({ error: t("shared.invalidForm") });
  }
};

export default function NewLinkedAccountRoute() {
  const data = useLoaderData<LoaderData>();
  return <NewLinkedAccount linksCount={data.linksCount} featurePlanUsage={data.featurePlanUsage} />;
}
