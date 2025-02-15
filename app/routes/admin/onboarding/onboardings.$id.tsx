// @@@ pwned by 1m4unkn0wn @@@
import { useTranslation } from "react-i18next";
import { Outlet, useLoaderData, useParams } from "react-router";
import { getOnboarding, OnboardingWithDetails } from "~/modules/onboarding/db/onboarding.db.server";
import { LoaderFunctionArgs, redirect } from "react-router";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import TabsVertical from "~/components/ui/tabs/TabsVertical";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";

type LoaderData = {
  item: OnboardingWithDetails;
};
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.onboarding.update");
  const item = await getOnboarding(params.id!);
  if (!item) {
    throw redirect("/admin/onboarding/onboardings");
  }
  return Response.json({ item });
};

export default function () {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();
  const params = useParams();

  // useEffect(() => {
  //   if (UrlUtils.stripTrailingSlash(location.pathname) === `/admin/accounts/users/pages/edit/${params.id}`) {
  //     navigate(`/admin/accounts/users/pages/edit/${params.id}/blocks`);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [location.pathname]);

  return (
    <div>
      <EditPageLayout
        title={`${t(data.item.title)}`}
        menu={[
          {
            title: t("onboarding.object.plural"),
            routePath: "/admin/onboarding/onboardings",
          },
          {
            title: data.item.title,
          },
        ]}
        withHome={false}
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 xl:gap-12">
          <div className="lg:col-span-3">
            <TabsVertical
              exact={true}
              tabs={[
                {
                  name: t("shared.overview"),
                  routePath: `/admin/onboarding/onboardings/${params.id}`,
                },
                {
                  name: t("onboarding.object.steps") + ` (${data.item.filters.length})`,
                  routePath: `/admin/onboarding/onboardings/${params.id}/steps`,
                },
                {
                  name: t("onboarding.object.filters") + ` (${data.item.filters.length})`,
                  routePath: `/admin/onboarding/onboardings/${params.id}/filters`,
                },
                {
                  name: t("onboarding.session.plural") + ` (${data.item.sessions.length})`,
                  routePath: `/admin/onboarding/onboardings/${params.id}/sessions`,
                },
                {
                  name: t("shared.dangerZone"),
                  routePath: `/admin/onboarding/onboardings/${params.id}/danger`,
                },
              ]}
            />
          </div>
          <div className="lg:col-span-9">
            <div className="w-full">
              <Outlet />
            </div>
          </div>
        </div>
      </EditPageLayout>
    </div>
  );
}
