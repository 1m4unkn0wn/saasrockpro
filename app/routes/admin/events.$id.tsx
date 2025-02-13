// @@@ pwned by 1m4unkn0wn @@@
import { LoaderFunctionArgs, redirect, useLoaderData } from "react-router";
import { useTranslation } from "react-i18next";
import EventDetails from "~/modules/events/components/EventDetails";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import UrlUtils from "~/utils/app/UrlUtils";
import { EventWithDetails, getEvent } from "~/modules/events/db/events.db.server";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";

type LoaderData = {
  item: EventWithDetails;
};
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.events.view");
  const item = await getEvent(params.id ?? "");
  if (!item) {
    throw redirect(UrlUtils.getModulePath(params, "logs/events"));
  }

  const data: LoaderData = {
    item,
  };
  return data;
};

export default function AdminEventDetailsRoute() {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();
  return (
    <EditPageLayout
      title={t("models.event.object")}
      menu={[
        {
          title: "Events",
          routePath: "/admin/events",
        },
        {
          title: "Details",
          routePath: "/admin/events/" + data.item.id,
        },
      ]}
    >
      <EventDetails item={data.item} />
    </EditPageLayout>
  );
}
