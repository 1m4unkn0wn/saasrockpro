// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunctionArgs, LoaderFunctionArgs, redirect, useLoaderData } from "react-router";
import { TenantRelationshipForm } from "~/components/core/tenants/relationships/TenantRelationshipForm";
import { getTranslations } from "~/locale/i18next.server";
import { TenantSimple, adminGetAllTenants, getTenant } from "~/utils/db/tenants.db.server";
import { createTenantRelationship, getTenantRelationship } from "~/utils/db/tenants/tenantRelationships.db.server";
import {
  TenantTypeRelationshipWithDetails,
  getAllTenantTypeRelationships,
  getTenantTypeRelationshipById,
} from "~/utils/db/tenants/tenantTypeRelationships.db.server";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import { getUserInfo } from "~/utils/session.server";

type LoaderData = {
  tenantTypeRelationships: TenantTypeRelationshipWithDetails[];
  allTenants: TenantSimple[];
};
export const loader = async ({ request }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.relationships.create");
  const data: LoaderData = {
    tenantTypeRelationships: await getAllTenantTypeRelationships(),
    allTenants: await adminGetAllTenants(),
  };
  return data;
};

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { t } = await getTranslations(request);
  const userInfo = await getUserInfo(request);
  const form = await request.formData();
  const action = form.get("action")?.toString();

  if (action === "create") {
    await verifyUserHasPermission(request, "admin.relationships.create");
    const tenantTypeRelationshipId = form.get("relationshipId")?.toString().trim() ?? "";
    const fromTenantId = form.get("fromTenantId")?.toString().trim() ?? "";
    const toTenantId = form.get("toTenantId")?.toString().trim() ?? "";
    const existing = await getTenantRelationship({ tenantTypeRelationshipId, fromTenantId, toTenantId });
    if (existing) {
      return Response.json({ error: "Already linked" }, { status: 400 });
    }
    const relationship = await getTenantTypeRelationshipById(tenantTypeRelationshipId);
    const fromTenant = await getTenant(fromTenantId);
    const toTenant = await getTenant(toTenantId);

    if (!relationship) {
      return Response.json({ error: "Relationship not found" }, { status: 400 });
    }
    if (!fromTenant) {
      return Response.json({ error: "From tenant not found" }, { status: 400 });
    }
    if (!toTenant) {
      return Response.json({ error: "To tenant not found" }, { status: 400 });
    }
    await createTenantRelationship({
      tenantTypeRelationshipId,
      fromTenantId,
      toTenantId,
      createdByUserId: userInfo.userId,
    });
    return redirect("/admin/accounts/relationships");
  } else {
    return Response.json({ error: t("shared.invalidForm") }, { status: 400 });
  }
};

export default function () {
  const data = useLoaderData<LoaderData>();

  return (
    <div>
      <TenantRelationshipForm item={undefined} allTenants={data.allTenants} tenantTypeRelationships={data.tenantTypeRelationships} />
    </div>
  );
}
