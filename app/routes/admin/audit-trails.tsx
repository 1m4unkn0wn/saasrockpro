// @@@ pwned by 1m4unkn0wn @@@
import { useTranslation } from "react-i18next";
import { LoaderFunctionArgs, MetaFunction, useLoaderData } from "react-router";
import LogsTable from "~/components/app/events/LogsTable";
import IndexPageLayout from "~/components/ui/layouts/IndexPageLayout";
import { getTranslations } from "~/locale/i18next.server";
import { getAllLogs, LogWithDetails } from "~/utils/db/logs.db.server";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import { getFiltersFromCurrentUrl, getPaginationFromCurrentUrl } from "~/utils/helpers/RowPaginationHelper";
import { PaginationDto } from "~/application/dtos/data/PaginationDto";
import { FilterablePropertyDto } from "~/application/dtos/data/FilterablePropertyDto";
import InputFilters from "~/components/ui/input/InputFilters";

type LoaderData = {
  title: string;
  items: LogWithDetails[];
  pagination: PaginationDto;
  filterableProperties: FilterablePropertyDto[];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.auditTrails.view");
  const { t } = await getTranslations(request);

  const filterableProperties: FilterablePropertyDto[] = [
    {
      name: "action",
      title: "models.log.action",
    },
    {
      name: "url",
      title: "models.log.url",
    },
  ];
  const filters = getFiltersFromCurrentUrl(request, filterableProperties);
  const urlSearchParams = new URL(request.url).searchParams;
  const currentPagination = getPaginationFromCurrentUrl(urlSearchParams);
  const { items, pagination } = await getAllLogs(currentPagination, filters);

  const data: LoaderData = {
    title: `${t("models.log.plural")} | ${process.env.APP_NAME}`,
    items,
    pagination,
    filterableProperties,
  };
  return data;
};

export const meta: MetaFunction<typeof loader> = ({ data }) => [{ title: data?.title }];

export default function Events() {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();

  return (
    <IndexPageLayout title={t("models.log.plural")} buttons={<InputFilters filters={data.filterableProperties} />}>
      <LogsTable withTenant={true} items={data.items} pagination={data.pagination} />
    </IndexPageLayout>
  );
}
