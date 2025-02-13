// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunction, LoaderFunctionArgs, redirect } from "react-router";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import { getTranslations } from "~/locale/i18next.server";
import {
  deleteOnboardingSession,
  getOnboardingSession,
  OnboardingSessionWithDetails,
  updateOnboardingSession,
} from "~/modules/onboarding/db/onboardingSessions.db.server";
import { OnboardingSessionStatus } from "~/modules/onboarding/dtos/OnboardingSessionStatus";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";

export namespace OnboardingSessionOverviewApi {
  export type LoaderData = {
    meta: MetaTagsDto;
    item: OnboardingSessionWithDetails;
  };
  export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    await verifyUserHasPermission(request, "admin.onboarding.view");
    const { t } = await getTranslations(request);
    const item = await getOnboardingSession(params.id!);
    if (!item) {
      throw redirect("/onboarding/sessions");
    }
    const data: LoaderData = {
      meta: [{ title: `${t("onboarding.session.object")} | ${process.env.APP_NAME}` }],
      item,
    };
    return data;
  };

  export type ActionData = {
    error?: string;
  };
  export const action: ActionFunction = async ({ request, params }) => {
    await verifyUserHasPermission(request, "admin.onboarding.update");
    const { t } = await getTranslations(request);
    const form = await request.formData();
    const action = form.get("action");
    const item = await getOnboardingSession(params.id!);
    if (!item) {
      return redirect("/onboarding/sessions");
    }
    if (action === "update") {
      const status = form.get("status")?.toString();
      const startedAt = form.get("startedAt")?.toString();
      const completedAt = form.get("completedAt")?.toString();
      const dismissedAt = form.get("dismissedAt")?.toString();
      await updateOnboardingSession(item.id, {
        status: status !== undefined ? (status as OnboardingSessionStatus) : undefined,
        startedAt: startedAt !== undefined ? new Date(startedAt) : undefined,
        completedAt: completedAt !== undefined ? new Date(completedAt) : undefined,
        dismissedAt: dismissedAt !== undefined ? new Date(dismissedAt) : undefined,
      });
      return Response.json({ success: true });
    } else if (action === "delete") {
      await verifyUserHasPermission(request, "admin.onboarding.delete");
      await deleteOnboardingSession(item.id);
      return redirect("/onboarding/sessions");
    } else {
      return Response.json({ error: t("shared.invalidForm") }, { status: 400 });
    }
  };
}
