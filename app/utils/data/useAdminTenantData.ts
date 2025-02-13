// @@@ pwned by 1m4unkn0wn @@@
import { Tenant, TenantUser } from "@prisma/client";
import { useMatches } from "react-router";
import { getTranslations } from "~/locale/i18next.server";
import { getTenantWithUsers } from "../db/tenants.db.server";

export type AdminTenantLoaderData = {
  title: string;
  tenant: (Tenant & { users: TenantUser[] }) | null;
};

export function useAdminTenantData(id?: string): AdminTenantLoaderData {
  return (useMatches().find((f) => f.pathname === "/admin/tenant/" + id)?.data ?? {}) as AdminTenantLoaderData;
}

export async function loadAdminTenantData(request: Request, id?: string) {
  const { t } = await getTranslations(request);
  const tenant = await getTenantWithUsers(id);
  const data: AdminTenantLoaderData = {
    title: `${t("models.tenant.object")} | ${process.env.APP_NAME}`,
    tenant,
  };
  return data;
}
