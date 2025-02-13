// @@@ pwned by 1m4unkn0wn @@@
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate, redirect, MetaFunction, LoaderFunctionArgs } from "react-router";
import UrlUtils from "~/utils/app/UrlUtils";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import { getTranslations } from "~/locale/i18next.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.analytics.view");
  const { t } = await getTranslations(request);
  if (UrlUtils.stripTrailingSlash(new URL(request.url).pathname) === "/admin/analytics") {
    throw redirect("/admin/analytics/overview");
  }

  return {
    title: `${t("analytics.title")} | ${process.env.APP_NAME}`,
  };
};

export const meta: MetaFunction<typeof loader> = ({ data }) => [{ title: data?.title }];

export default function AdminAnalticsRoute() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (UrlUtils.stripTrailingSlash(location.pathname) === "/admin/analytics") {
      navigate("/admin/analytics/overview");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return <Outlet />;
}
