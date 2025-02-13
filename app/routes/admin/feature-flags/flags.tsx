// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunctionArgs, LoaderFunction, MetaFunction, useLoaderData } from "react-router";
import { FeatureFlag } from "@prisma/client";
import { FeatureFlagWithEvents, getFeatureFlag, getFeatureFlagsWithEvents, updateFeatureFlag } from "~/modules/featureFlags/db/featureFlags.db.server";
import SimpleBadge from "~/components/ui/badges/SimpleBadge";
import { Colors } from "~/application/enums/shared/Colors";
import { useTranslation } from "react-i18next";
import { Link, Outlet, useSearchParams, useSubmit } from "react-router";
import TabsWithIcons from "~/components/ui/tabs/TabsWithIcons";
import ButtonPrimary from "~/components/ui/buttons/ButtonPrimary";
import PlusIcon from "~/components/ui/icons/PlusIcon";
import InfoBanner from "~/components/ui/banners/InfoBanner";
import TableSimple from "~/components/ui/tables/TableSimple";
import InputCheckbox from "~/components/ui/input/InputCheckbox";
import { getTranslations } from "~/locale/i18next.server";
import DateCell from "~/components/ui/dates/DateCell";
import { v2MetaFunction } from "~/utils/compat/v2MetaFunction";

type LoaderData = {
  title: string;
  items: FeatureFlagWithEvents[];
};
export const loader: LoaderFunction = async ({ request }) => {
  const { t } = await getTranslations(request);
  const data: LoaderData = {
    title: `${t("featureFlags.title")} | ${process.env.APP_NAME}`,
    items: await getFeatureFlagsWithEvents({ enabled: undefined }),
  };
  return Response.json(data);
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { t } = await getTranslations(request);
  const form = await request.formData();
  const action = form.get("action")?.toString();

  if (action === "toggle") {
    const id = form.get("id")?.toString() ?? "";
    const enabled = form.get("enabled")?.toString() === "true";

    const flag = await getFeatureFlag({ id });
    if (!flag) {
      return Response.json({ error: t("shared.notFound") }, { status: 400 });
    }

    await updateFeatureFlag(id, {
      enabled,
    });

    return Response.json({ success: t("shared.success") });
  } else {
    return Response.json({ error: t("shared.invalidForm") }, { status: 400 });
  }
};

export const meta: v2MetaFunction<LoaderData> = ({ data }) => [{ title: data?.title }];

export default function CampaignsListRoute() {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();
  const submit = useSubmit();

  const [searchParams] = useSearchParams();

  function countStatus(enabled?: boolean) {
    if (enabled === undefined) {
      return data.items.length;
    }
    return data.items.filter((item) => item.enabled === enabled).length;
  }
  function onToggle(item: FeatureFlag, enabled: boolean) {
    const form = new FormData();
    form.set("action", "toggle");
    form.set("enabled", enabled.toString());
    form.set("id", item.id.toString());
    submit(form, {
      method: "post",
    });
  }
  function filteredItems() {
    if (searchParams.get("status") === "active") {
      return data.items.filter((item) => item.enabled);
    }
    if (searchParams.get("status") === "inactive") {
      return data.items.filter((item) => !item.enabled);
    }
    return data.items;
  }
  return (
    <div className="mx-auto mb-12 max-w-5xl space-y-5 px-4 py-4 sm:px-6 lg:px-8 xl:max-w-7xl">
      <div className="flex items-center justify-between space-x-2">
        <div className="flex-grow">
          <TabsWithIcons
            tabs={[
              {
                name: `All ${countStatus() ? `(${countStatus()})` : ""}`,
                href: "?",
                current: !searchParams.get("status") || searchParams.get("status") === "all",
              },
              {
                name: `Active ${countStatus(true) ? `(${countStatus(true)})` : ""}`,
                href: "?status=active",
                current: searchParams.get("status") === "active",
              },
              {
                name: `Inactive ${countStatus(false) ? `(${countStatus(false)})` : ""}`,
                href: "?status=inactive",
                current: searchParams.get("status") === "inactive",
              },
            ]}
          />
        </div>
        <div>
          <ButtonPrimary to="new">
            <div>{t("shared.new")}</div>
            <PlusIcon className="h-5 w-5" />
          </ButtonPrimary>
        </div>
      </div>

      {data.items.length === 0 && <InfoBanner title="Demo" text={t("featureFlags.empty.demo")} />}

      <TableSimple
        items={filteredItems()}
        actions={[
          {
            title: t("shared.overview"),
            onClickRoute: (_, i) => `${i.id}`,
          },
        ]}
        headers={[
          {
            name: "status",
            title: "Status",
            value: (i) => {
              return <InputCheckbox asToggle value={i.enabled} setValue={(checked) => onToggle(i, Boolean(checked))} />;
            },
          },
          {
            name: "featureFlag",
            title: t("featureFlags.object"),
            className: "w-full",
            value: (i) => (
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <div className="text-base font-bold">{i.description}</div>
                  <SimpleBadge title={i.name} color={Colors.GRAY} />
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Link to={"/admin/analytics/events?featureFlagId=" + i.id} className="lowercase">
                    {i.events.length} {t("featureFlags.triggers")}
                  </Link>
                  <div>•</div>
                  <div>
                    {i.filters.length === 0 ? (
                      <span>{t("featureFlags.noFilters")}</span>
                    ) : i.filters.length === 1 ? (
                      <span>{t("featureFlags.filter")}: </span>
                    ) : (
                      <span className="lowercase">
                        {i.filters.length} {t("featureFlags.filters")}:{" "}
                      </span>
                    )}
                    {i.filters.map((f) => f.type).join(", ")}
                  </div>
                </div>
              </div>
            ),
          },
          {
            name: "createdAt",
            title: t("shared.createdAt"),
            value: (i) => <DateCell date={i.createdAt} />,
          },
        ]}
        noRecords={
          <div className="p-12 text-center">
            <h3 className="mt-1 text-sm font-medium text-gray-900">{t("featureFlags.empty.title")}</h3>
            <p className="mt-1 text-sm text-gray-500">{t("featureFlags.empty.description")}</p>
          </div>
        }
      />

      <Outlet />
    </div>
  );
}
