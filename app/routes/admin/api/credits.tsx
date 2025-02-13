// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunction, LoaderFunctionArgs, useLoaderData } from "react-router";
import { FilterablePropertyDto } from "~/application/dtos/data/FilterablePropertyDto";
import { PaginationDto } from "~/application/dtos/data/PaginationDto";
import { getTranslations } from "~/locale/i18next.server";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import { getFiltersFromCurrentUrl, getPaginationFromCurrentUrl } from "~/utils/helpers/RowPaginationHelper";
import { adminGetAllTenantsIdsAndNames } from "~/utils/db/tenants.db.server";
import { adminGetAllUsersNames } from "~/utils/db/users.db.server";
import { useTranslation } from "react-i18next";
import CreditsList from "~/modules/usage/components/CreditsList";
import { CreditWithDetails, deleteCredits, getAllCredits } from "~/modules/usage/db/credits.db.server";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";

type LoaderData = {
  items: CreditWithDetails[];
  filterableProperties: FilterablePropertyDto[];
  pagination: PaginationDto;
  canDelete: boolean;
};
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.apiKeys.view");
  const { t } = await getTranslations(request);
  const filterableProperties: FilterablePropertyDto[] = [
    {
      name: "tenantId",
      title: t("models.tenant.object"),
      options: [
        { value: "null", name: "{null}" },
        ...(await adminGetAllTenantsIdsAndNames()).map((item) => {
          return {
            value: item.id,
            name: item.name,
          };
        }),
      ],
    },
    {
      name: "userId",
      title: t("models.user.object"),
      options: [
        { value: "null", name: "{null}" },
        ...(await adminGetAllUsersNames()).map((item) => {
          return {
            value: item.id,
            name: item.email,
          };
        }),
      ],
    },
  ];
  const urlSearchParams = new URL(request.url).searchParams;
  const currentPagination = getPaginationFromCurrentUrl(urlSearchParams);
  const filters = getFiltersFromCurrentUrl(request, filterableProperties);
  const { items, pagination } = await getAllCredits({ tenantId: null, filters, filterableProperties, pagination: currentPagination });
  const data: LoaderData = {
    items,
    filterableProperties,
    pagination,
    canDelete: true,
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
    await deleteCredits(ids);
    return Response.json({ success: true });
  } else {
    return Response.json({ error: t("shared.invalidForm"), success: false }, { status: 400 });
  }
};

export default function () {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();
  return (
    <EditPageLayout title={t("models.credit.plural")}>
      <CreditsList data={data} />
    </EditPageLayout>
  );
}
