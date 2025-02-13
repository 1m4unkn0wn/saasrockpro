// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunction, LoaderFunctionArgs, redirect } from "react-router";
import { getTranslations } from "~/locale/i18next.server";
import { getUserInfo } from "~/utils/session.server";
import { createOnboarding, getOnboardings, OnboardingWithDetails } from "../../../db/onboarding.db.server";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";

export namespace OnboardingIndexApi {
  export type LoaderData = {
    meta: MetaTagsDto;
    items: OnboardingWithDetails[];
    groupByStatus: { status: string; count: number }[];
  };
  export const loader = async ({ request }: LoaderFunctionArgs) => {
    await verifyUserHasPermission(request, "admin.onboarding.view");
    const { t } = await getTranslations(request);
    const urlSearchParams = new URL(request.url).searchParams;
    // const currentPagination = getPaginationFromCurrentUrl(urlSearchParams);
    const status = urlSearchParams.get("status");
    const items = await getOnboardings({
      active: status === "active" ? true : status === "inactive" ? false : undefined,
    });
    const groupByStatus: { status: string; count: number }[] = [];
    items.forEach((item) => {
      if (item.active) {
        const index = groupByStatus.findIndex((item) => item.status === "active");
        if (index === -1) {
          groupByStatus.push({ status: "active", count: 1 });
        } else {
          groupByStatus[index].count++;
        }
      } else if (!item.active) {
        const index = groupByStatus.findIndex((item) => item.status === "inactive");
        if (index === -1) {
          groupByStatus.push({ status: "inactive", count: 1 });
        } else {
          groupByStatus[index].count++;
        }
      }
    });

    const data: LoaderData = {
      meta: [{ title: `${t("onboarding.title")} | ${process.env.APP_NAME}` }],
      items,
      groupByStatus,
    };
    return data;
  };

  export type ActionData = {
    error?: string;
  };
  export const action: ActionFunction = async ({ request }) => {
    await verifyUserHasPermission(request, "admin.onboarding.update");
    const { t } = await getTranslations(request);
    const form = await request.formData();
    const userInfo = await getUserInfo(request);
    const action = form.get("action");
    if (action === "create") {
      await verifyUserHasPermission(request, "admin.onboarding.create");
      const title = form.get("title")?.toString() ?? "";
      if (!title) {
        return Response.json({ error: "Onboarding title is required" }, { status: 400 });
      }
      const onboarding = await createOnboarding({
        title,
        type: "modal",
        active: false,
        realtime: false,
        canBeDismissed: true,
        height: "xl",
        filters: [{ type: "user.is", value: userInfo.userId }],
        steps: [],
      });
      return redirect(`/admin/onboarding/onboardings/${onboarding.id}`);
    } else {
      return Response.json({ error: t("shared.invalidForm") }, { status: 400 });
    }
  };
}
