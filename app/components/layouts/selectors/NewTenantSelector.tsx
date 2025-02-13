// @@@ pwned by 1m4unkn0wn @@@
import { useLocation, useNavigate } from "react-router";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import PlusIcon from "~/components/ui/icons/PlusIcon";
import InputSelectorDarkMode from "~/components/ui/input/dark/InputSelectorDarkMode";
import InputSelector from "~/components/ui/input/InputSelector";
import { useAppData } from "~/utils/data/useAppData";
import { TenantSimple } from "~/utils/db/tenants.db.server";
import { TenantTypeRelationshipWithDetails } from "~/utils/db/tenants/tenantTypeRelationships.db.server";

interface Props {
  className?: string;
}

export default function TenantSelector({ className }: Props) {
  const { t } = useTranslation();
  const appData = useAppData();
  const location = useLocation();
  const navigate = useNavigate();

  const [selected, setSelected] = useState(appData?.currentTenant?.slug);

  const tenants: { relationship?: TenantTypeRelationshipWithDetails; tenant: TenantSimple }[] = [
    ...appData?.childTenants.map((f) => {
      return {
        tenant: f.toTenant,
        relationship: f.tenantTypeRelationship,
      };
    }),
    ...appData?.myTenants.map((tenant) => {
      return {
        tenant,
      };
    }),
  ];

  useEffect(() => {
    if (selected) {
      const tenant = tenants.find((f) => f.tenant.slug === selected);
      if (tenant && tenant?.tenant.id !== appData.currentTenant.id) {
        navigate(
          location.pathname
            .replace(`/app/${appData?.currentTenant.slug}`, `/app/${tenant.tenant.slug}`)
            .replace(`/app/${appData?.currentTenant.id}`, `/app/${tenant.tenant.slug}`)
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  function getAllTenants() {
    const items = tenants
      .map((f) => {
        let group = t("models.tenant.plural");
        if (f.relationship) {
          group = f.relationship?.toType?.titlePlural ?? t("models.tenant.object");
        } else if (f.tenant.types.length > 0) {
          group = f.tenant.types[0].titlePlural ?? t("models.tenant.plural");
        }
        return {
          group,
          value: f.tenant.slug,
          name: (
            <div className="flex items-center space-x-2">
              {f.tenant.icon ? (
                <img className="inline-block h-4 w-4 shrink-0 rounded-md shadow-sm" src={f.tenant.icon} alt={f.tenant.name} />
              ) : (
                <span className="bg-primary inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-md">
                  <span className="text-primary-foreground text-xs font-medium leading-none">{f.tenant?.name.substring(0, 1)}</span>
                </span>
              )}
              <div>
                {f.relationship ? (
                  <div>
                    {f?.relationship?.toType?.title ?? t("models.tenant.object")}: {f?.tenant.name}
                  </div>
                ) : (
                  <div>{f?.tenant.name}</div>
                )}
              </div>
            </div>
          ),
          // link: location.pathname.replace(`/app/${appData.currentTenant.slug}`, `/app/${f?.slug}`),
        };
      })
      .sort((a, b) => a.group.localeCompare(b.group));
    // return unique slugs
    const unique = items.filter((item, index, self) => self.findIndex((t) => t.value === item.value) === index);
    return [
      ...unique,
      {
        title: "hey",
        value: "{new}",
        className: "border-t border-border rounded-none",
        name: (
          <div className="flex items-center gap-2">
            <div className="w-4 flex-shrink-0">
              <PlusIcon className="h-4 w-4 p-0.5" />
            </div>
            <div>{t("app.tenants.create.title")}</div>
          </div>
        ),
      },
    ];
  }
  return (
    <div className="text-foreground">
      {tenants.length > 1 && (
        <InputSelector
          selectPlaceholder=""
          withSearch={false}
          value={selected}
          options={getAllTenants()}
          setValue={(e) => {
            if (e === "{new}") {
              navigate("/new-account");
              setSelected(e?.toString() ?? "");
            } else {
              setSelected(e?.toString() ?? "");
            }
          }}
        />
      )}
    </div>
  );
}
