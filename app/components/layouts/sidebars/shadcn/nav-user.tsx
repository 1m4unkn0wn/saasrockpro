// @@@ pwned by 1m4unkn0wn @@@
"use client";

import { BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router";
import { Fragment } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import GearIcon from "~/components/ui/icons/GearIcon";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "~/components/ui/sidebar";
import UrlUtils from "~/utils/app/UrlUtils";
import UserUtils from "~/utils/app/UserUtils";

export function NavUser({
  user,
  layout,
}: {
  user: { email: string; firstName: string | null; lastName: string | null; avatar: string | null; admin?: { userId: string } | null };
  layout: "app" | "admin" | "docs";
}) {
  const { t } = useTranslation();
  const { isMobile } = useSidebar();
  const params = useParams();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar || ""} alt={UserUtils.fullName(user)} />
                <AvatarFallback className="rounded-lg">{UserUtils.avatarText(user)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{UserUtils.fullName(user)}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar || ""} alt={UserUtils.fullName(user)} />
                  <AvatarFallback className="rounded-lg">{UserUtils.avatarText(user)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{UserUtils.fullName(user)}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {layout === "app" ? (
              <Fragment>
                <DropdownMenuGroup>
                  <Link to={!params.tenant ? "" : UrlUtils.currentTenantUrl(params, `settings/profile`)}>
                    <DropdownMenuItem>
                      <GearIcon className="mr-2 h-4 w-4" />
                      {t("app.navbar.profile")}
                    </DropdownMenuItem>
                  </Link>
                  <Link to={UrlUtils.currentTenantUrl(params, `settings/subscription`)}>
                    <DropdownMenuItem>
                      <CreditCard className="mr-2 h-4 w-4" />
                      {t("app.navbar.subscription")}
                    </DropdownMenuItem>
                  </Link>
                  <Link to={UrlUtils.currentTenantUrl(params, `settings/account`)}>
                    <DropdownMenuItem>
                      <BadgeCheck className="mr-2 h-4 w-4" />
                      {t("app.navbar.tenant")}
                    </DropdownMenuItem>
                  </Link>

                  {/* <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </DropdownMenuItem> */}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
              </Fragment>
            ) : layout === "admin" ? (
              <Fragment>
                <DropdownMenuGroup>
                  <Link to="/admin/settings/profile">
                    <DropdownMenuItem>
                      <GearIcon className="mr-2 h-4 w-4" />
                      {t("app.navbar.profile")}
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
              </Fragment>
            ) : null}
            <Link to="/logout">
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                {t("app.navbar.signOut")}
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
