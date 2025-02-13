// @@@ pwned by 1m4unkn0wn @@@
"use client";

import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "~/components/ui/sidebar";
import { useTranslation } from "react-i18next";
import { useAppData } from "~/utils/data/useAppData";
import { Link, useLocation, useNavigate } from "react-router";
import { TenantSimple } from "~/utils/db/tenants.db.server";
import clsx from "clsx";

export function TeamSwitcher({ tenants, size = "md" }: { tenants: TenantSimple[]; size?: "sm" | "md" }) {
  const { t } = useTranslation();
  const { isMobile } = useSidebar();

  const appData = useAppData();
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTenant, setActiveTeam] = React.useState(appData?.currentTenant);

  const activeTenantDescription = appData.mySubscription?.products.length
    ? t(appData.mySubscription.products.find((f) => f)?.subscriptionProduct.title || "")
    : t("settings.subscription.noSubscription");

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size={size === "md" ? "lg" : "default"}
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div
                className={clsx(
                  "flex aspect-square items-center justify-center rounded-lg",
                  size === "sm" && "size-6",
                  size === "md" && "text-foreground size-8"
                )}
              >
                {/* <activeTeam.logo className="size-4" /> */}
                {activeTenant.icon ? (
                  <img className="size-7 shrink-0 rounded-md" src={activeTenant.icon} alt={activeTenant.name} />
                ) : (
                  <span className="bg-primary inline-flex size-7 shrink-0 items-center justify-center rounded-md">
                    <span className="text-primary-foreground text-xs font-medium uppercase leading-none">{activeTenant.name.substring(0, 1)}</span>
                  </span>
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{activeTenant.name}</span>
                {size === "md" && <span className="truncate text-xs">{activeTenantDescription}</span>}
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">{t("models.tenant.plural")}</DropdownMenuLabel>
            {tenants.map((tenant, index) => (
              <DropdownMenuItem
                key={tenant.name}
                onClick={() => {
                  navigate(
                    location.pathname
                      .replace(`/app/${appData?.currentTenant.slug}`, `/app/${tenant.slug}`)
                      .replace(`/app/${appData?.currentTenant.id}`, `/app/${tenant.slug}`)
                  );
                }}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-sm border">
                  {/* <team.logo className="size-4 shrink-0" /> */}

                  {tenant.icon ? (
                    <img className=" size-4 shrink-0" src={tenant.icon} alt={tenant.name} />
                  ) : (
                    <span className="inline-flex size-4 shrink-0 items-center justify-center rounded-md">
                      <span className="text-xs font-medium uppercase leading-none">{tenant.name.substring(0, 1)}</span>
                    </span>
                  )}
                </div>
                {tenant.name}
                {/* <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut> */}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <Link to="/new-account">
              <DropdownMenuItem className="gap-2 p-2">
                <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                  <Plus className="size-4" />
                </div>
                <div className="text-muted-foreground font-medium">{t("app.tenants.create.title")}</div>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
