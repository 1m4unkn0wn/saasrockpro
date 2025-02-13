// @@@ pwned by 1m4unkn0wn @@@
import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import ButtonPrimary from "~/components/ui/buttons/ButtonPrimary";
import ButtonSecondary from "~/components/ui/buttons/ButtonSecondary";
import DateCell from "~/components/ui/dates/DateCell";
import CheckIcon from "~/components/ui/icons/CheckIcon";
import ExternalLinkEmptyIcon from "~/components/ui/icons/ExternalLinkEmptyIcon";
import XIcon from "~/components/ui/icons/XIcon";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import TableSimple from "~/components/ui/tables/TableSimple";
import { SurveyWithDetails, getAllSurveys } from "~/modules/surveys/db/surveys.db.server";
import { getAppConfiguration } from "~/utils/db/appConfiguration.db.server";
import { requireAuth } from "~/utils/loaders.middleware";
import { getTenantIdOrNull } from "~/utils/services/.server/urlService";
import NumberUtils from "~/utils/shared/NumberUtils";

type LoaderData = {
  items: SurveyWithDetails[];
};

export let loader = async ({ request, params }: LoaderFunctionArgs) => {
  const appConfiguration = await getAppConfiguration({ request });
  if (!appConfiguration.app.features.surveys) {
    throw Response.json({ error: "Surveys are not enabled" }, { status: 400 });
  }
  await requireAuth({ request, params });
  const tenantId = await getTenantIdOrNull({ request, params });
  const items = await getAllSurveys({ tenantId });
  const data: LoaderData = {
    items,
  };
  return data;
};

export default function () {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();
  return (
    <EditPageLayout
      title="Surveys"
      buttons={
        <>
          <ButtonSecondary target="_blank" to="/surveys">
            {t("shared.viewAll")}
          </ButtonSecondary>
          <ButtonPrimary to="new">{t("shared.new")}</ButtonPrimary>
        </>
      }
    >
      <TableSimple
        items={data.items}
        actions={[
          {
            title: "Public URL",
            // onClickRouteTarget: "_blank",
            renderTitle: () => (
              <div className="flex items-center space-x-2">
                <div>Public URL</div>
                <ExternalLinkEmptyIcon className="text-muted-foreground h-4 w-4" />
              </div>
            ),
            onClickRoute: (_, item) => `/surveys/${item.slug}`,
          },
          {
            title: "Overview",
            onClickRoute: (_, item) => item.id,
          },
          {
            title: "Submissions",
            onClickRoute: (_, item) => `${item.id}/submissions`,
          },
          {
            title: "Edit",
            onClickRoute: (_, item) => `${item.id}/edit`,
          },
        ]}
        headers={[
          {
            name: "survey",
            title: "Survey",
            className: "w-full",
            value: (item) => (
              <div>
                <Link to={`${item.id}`} className="font-medium hover:underline">
                  {" "}
                  {item.title}
                </Link>
              </div>
            ),
          },
          {
            name: "isPublic",
            title: "Public",
            value: (item) => (item.isPublic ? <CheckIcon className="h-5 w-5 text-teal-500" /> : <XIcon className="text-muted-foreground h-5 w-5" />),
          },
          {
            name: "isEnabled",
            title: "Enabled",
            value: (item) => (item.isEnabled ? <CheckIcon className="h-5 w-5 text-teal-500" /> : <XIcon className="text-muted-foreground h-5 w-5" />),
          },
          {
            name: "submissions",
            title: "Submissions",
            value: (item) => <Link to={`/admin/help-desk/surveys/${item.id}/submissions`}>{NumberUtils.intFormat(item._count.submissions)}</Link>,
          },
          {
            name: "createdAt",
            title: "Created At",
            value: (item) => <DateCell date={item.createdAt} />,
          },
        ]}
      />
    </EditPageLayout>
  );
}
