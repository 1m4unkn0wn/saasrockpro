// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunction, LoaderFunctionArgs, useLoaderData } from "react-router";
import { FilterablePropertyDto } from "~/application/dtos/data/FilterablePropertyDto";
import { PaginationDto } from "~/application/dtos/data/PaginationDto";
import { getTranslations } from "~/locale/i18next.server";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import ApiKeyLogService from "~/modules/api/services/ApiKeyLogService";
import { ApiKeyLogDto } from "~/modules/api/dtos/ApiKeyLogDto";
import ApiKeyLogsDetails from "~/modules/api/components/ApiKeyLogsDetails";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";

type LoaderData = {
  items: ApiKeyLogDto[];
  filterableProperties: FilterablePropertyDto[];
  pagination: PaginationDto;
};
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.apiKeys.view");
  const { items, filterableProperties, pagination } = await ApiKeyLogService.getDetails({ request, params });
  const data: LoaderData = {
    items,
    filterableProperties,
    pagination,
  };
  return data;
};

export const action: ActionFunction = async ({ request }) => {
  await verifyUserHasPermission(request, "admin.apiKeys.update");
  const { t } = await getTranslations(request);
  const form = await request.formData();
  if (form.get("action") === "delete") {
    await verifyUserHasPermission(request, "admin.apiKeys.delete");
    const ids = (form.get("ids")?.toString().split(",") ?? []).map((x) => x.toString() ?? "");
    await ApiKeyLogService.deleteMany(ids);
    return Response.json({ success: true });
  } else {
    return Response.json({ error: t("shared.invalidForm"), success: false }, { status: 400 });
  }
};

export default function () {
  const data = useLoaderData<LoaderData>();
  return (
    <EditPageLayout title="API Calls">
      <ApiKeyLogsDetails data={data} />
    </EditPageLayout>
  );
}
