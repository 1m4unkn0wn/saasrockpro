// @@@ pwned by 1m4unkn0wn @@@
"use client";

import * as React from "react";
import { AudioWaveform, BookOpen, Bot, Command, Frame, GalleryVerticalEnd, LifeBuoy, Map, PieChart, Send, Settings2, SquareTerminal } from "lucide-react";
import LogoDark from "~/assets/img/logo-dark.png";
import LogoLight from "~/assets/img/logo-light.png";
import { NavMain } from "./nav-main";
import { NavQuickLinks } from "./nav-quick-links";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "~/components/ui/sidebar";
import { useAppOrAdminData } from "~/utils/data/useAppOrAdminData";
import UserUtils from "~/utils/app/UserUtils";
import { AppSidebar } from "~/application/sidebar/AppSidebar";
import { useTranslation } from "react-i18next";
import { useRootData } from "~/utils/data/useRootData";
import { SideBarItem } from "~/application/sidebar/SidebarItem";
import { AdminSidebar } from "~/application/sidebar/AdminSidebar";
import { Link, useLocation, useParams } from "react-router";
import { DocsSidebar } from "~/application/sidebar/DocsSidebar";
import UrlUtils from "~/utils/app/UrlUtils";
import { useAppData } from "~/utils/data/useAppData";
import { SidebarGroupDto } from "~/application/sidebar/SidebarGroupDto";
import { TeamSwitcher } from "./team-switcher";
import NewTenantSelector from "../../selectors/NewTenantSelector";

export function ShadcnAppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  layout: "app" | "admin" | "docs";
  menuItems?: SideBarItem[];
}) {
  const { t } = useTranslation();
  const location = useLocation();
  const rootData = useRootData();
  const appOrAdminData = useAppOrAdminData();
  const appData = useAppData();
  const params = useParams();
  const appConfiguration = rootData.appConfiguration;

  // const data = {
  //   // user: {
  //   //   name: "shadcn",
  //   //   email: "m@example.com",
  //   //   avatar: "/avatars/shadcn.jpg",
  //   // },
  //   navMain: [
  //     {
  //       title: "Playground",
  //       url: "#",
  //       icon: SquareTerminal,
  //       isActive: true,
  //       items: [
  //         {
  //           title: "History",
  //           url: "#",
  //         },
  //         {
  //           title: "Starred",
  //           url: "#",
  //         },
  //         {
  //           title: "Settings",
  //           url: "#",
  //         },
  //       ],
  //     },
  //     {
  //       title: "Models",
  //       url: "#",
  //       icon: Bot,
  //       items: [
  //         {
  //           title: "Genesis",
  //           url: "#",
  //         },
  //         {
  //           title: "Explorer",
  //           url: "#",
  //         },
  //         {
  //           title: "Quantum",
  //           url: "#",
  //         },
  //       ],
  //     },
  //     {
  //       title: "Documentation",
  //       url: "#",
  //       icon: BookOpen,
  //       items: [
  //         {
  //           title: "Introduction",
  //           url: "#",
  //         },
  //         {
  //           title: "Get Started",
  //           url: "#",
  //         },
  //         {
  //           title: "Tutorials",
  //           url: "#",
  //         },
  //         {
  //           title: "Changelog",
  //           url: "#",
  //         },
  //       ],
  //     },
  //     {
  //       title: "Settings",
  //       url: "#",
  //       icon: Settings2,
  //       items: [
  //         {
  //           title: "General",
  //           url: "#",
  //         },
  //         {
  //           title: "Team",
  //           url: "#",
  //         },
  //         {
  //           title: "Billing",
  //           url: "#",
  //         },
  //         {
  //           title: "Limits",
  //           url: "#",
  //         },
  //       ],
  //     },
  //   ],
  //   navSecondary: [
  //     {
  //       title: "Support",
  //       url: "#",
  //       icon: LifeBuoy,
  //     },
  //     {
  //       title: "Feedback",
  //       url: "#",
  //       icon: Send,
  //     },
  //   ],
  //   projects: [
  //     {
  //       name: "Quick link 1",
  //       url: "#",
  //       icon: Frame,
  //     },
  //     {
  //       name: "Quick link 2",
  //       url: "#",
  //       icon: PieChart,
  //     },
  //     {
  //       name: "Quick link 3",
  //       url: "#",
  //       icon: Map,
  //     },
  //   ],
  // };

  const getMenuItems = () => {
    let menu: SideBarItem[] = [];
    if (props.menuItems) {
      menu = props.menuItems;
    } else if (props.layout === "admin") {
      menu = AdminSidebar({ t, appConfiguration: rootData.appConfiguration });
    } else if (props.layout === "app") {
      menu = AppSidebar({
        t,
        tenantId: params.tenant ?? "",
        entities: appOrAdminData?.entities ?? [],
        entityGroups: appOrAdminData?.entityGroups ?? [],
        appConfiguration: rootData.appConfiguration,
      });
    } else if (props.layout === "docs") {
      menu = DocsSidebar();
    }

    function clearItemsIfNotCollapsible(items: SideBarItem[]) {
      items.forEach((item) => {
        if (item.isCollapsible !== undefined && !item.isCollapsible) {
          item.items = [];
        }
        if (item.items) {
          clearItemsIfNotCollapsible(item.items);
        }
      });
    }
    clearItemsIfNotCollapsible(menu);

    menu.forEach((item) => {
      if (item.isCollapsible !== undefined && !item.isCollapsible) {
        item.items = [];
      }
      item.items?.forEach((subitem) => {
        if (subitem.isCollapsible !== undefined && !subitem.isCollapsible) {
          subitem.items = [];
        }
      });
    });
    // setMenu(layout === "admin" ? AdminSidebar : );
    menu.forEach((group) => {
      group.items?.forEach((element) => {
        if (element.open || isCurrent(element) || currentIsChild(element)) {
          // expanded.push(element.path);
        } else {
          // setExpanded(expanded.filter((f) => f !== element.path));
        }
      });
    });

    return menu || [];
  };

  function getPath(item: SideBarItem) {
    return UrlUtils.replaceVariables(params, item.path) ?? "";
  }

  function isCurrent(menuItem: SideBarItem) {
    if (menuItem.path) {
      if (menuItem.exact) {
        return location.pathname === getPath(menuItem);
      }
      return location.pathname?.includes(getPath(menuItem));
    }
  }

  function currentIsChild(menuItem: SideBarItem) {
    let hasOpenChild = false;
    menuItem.items?.forEach((item) => {
      if (isCurrent(item)) {
        hasOpenChild = true;
      }
    });
    return hasOpenChild;
  }
  function allowCurrentUserType(item: SideBarItem) {
    if (!item.adminOnly) {
      return true;
    }
    return appData?.user?.admin !== null;
  }
  function allowCurrentTenantUserType(item: SideBarItem) {
    return !item.tenantUserTypes || item.tenantUserTypes.includes(appData?.currentRole);
  }
  function checkUserRolePermissions(item: SideBarItem) {
    return !item.permission || appOrAdminData?.permissions?.includes(item.permission) || appOrAdminData?.permissions?.includes(item.permission);
  }
  function checkFeatureFlags(item: SideBarItem) {
    return !item.featureFlag || rootData.featureFlags?.includes(item.featureFlag);
  }
  const getMenu = (): SidebarGroupDto[] => {
    function filterItem(f: SideBarItem) {
      return f.hidden !== true && allowCurrentUserType(f) && allowCurrentTenantUserType(f) && checkUserRolePermissions(f) && checkFeatureFlags(f);
    }
    const _menu: SidebarGroupDto[] = [];
    getMenuItems()
      .filter((f) => filterItem(f))
      .forEach((f) => {
        let type: "main" | "secondary" | "quick-link" = "main";
        if (f.isSecondary) {
          type = "secondary";
        } else if (f.isQuickLink) {
          type = "quick-link";
        }
        _menu.push({
          title: f.title.toString(),
          items:
            f.items
              ?.filter((f) => filterItem(f))
              .map((f) => {
                return {
                  ...f,
                  items: f.items?.filter((f) => filterItem(f)),
                };
              }) ?? [],
          type,
        });
      });
    return _menu.filter((f) => f.items.length > 0);
  };

  const navMain = getMenu().filter((f) => f.type === "main");
  const navSecondary = getMenu().find((f) => f.type === "secondary") || { items: [] };
  const navQuickLinks = getMenu().find((f) => f.type === "quick-link");

  return (
    <Sidebar variant="sidebar" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to={"/"} className="flex justify-center">
                <div className="flex shrink-0 items-center justify-center border-b border-transparent">
                  {/* <Logo size="h-8 p-1 w-auto" /> */}
                  <img
                    className={"mx-auto hidden h-10 w-auto p-1.5 dark:flex"}
                    src={appConfiguration.branding.logoDarkMode || appConfiguration.branding.logo || LogoDark}
                    alt="Logo"
                  />
                  <img
                    className={"mx-auto h-10 w-auto p-1.5 dark:hidden"}
                    src={appConfiguration.branding.logoDarkMode || appConfiguration.branding.logo || LogoLight}
                    alt="Logo"
                  />
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        {/* {props.layout === "app" && (
          <SidebarMenu>
            <div>{appData?.currentTenant && <NewTenantSelector key={params.tenant} />}</div>
          </SidebarMenu>
        )} */}
        {props.layout === "app" && appData?.currentTenant && <TeamSwitcher key={params.tenant} size="md" tenants={appData?.myTenants ?? []} />}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        {navQuickLinks && <NavQuickLinks item={navQuickLinks} />}
        <NavSecondary item={navSecondary} className="mt-auto" />
      </SidebarContent>
      {appOrAdminData.user && (
        <SidebarFooter>
          <NavUser layout={props.layout} user={appOrAdminData.user} />
        </SidebarFooter>
      )}
    </Sidebar>
  );
}
