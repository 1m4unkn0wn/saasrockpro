// @@@ pwned by 1m4unkn0wn @@@
"use client";

import * as React from "react";
import {
  ArrowDown,
  ArrowUp,
  BadgeCheck,
  Bell,
  Copy,
  CornerUpLeft,
  CornerUpRight,
  CreditCard,
  FileText,
  GalleryVerticalEnd,
  LineChart,
  LogOut,
  MoreHorizontal,
  Settings2,
  Star,
  Trash,
  Trash2,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "~/components/ui/sidebar";
import NavBar from "../../NavBar";
import { getUserHasPermission } from "~/utils/helpers/PermissionsHelper";
import { useTitleData } from "~/utils/data/useTitleData";
import { useAppOrAdminData } from "~/utils/data/useAppOrAdminData";
import { useRootData } from "~/utils/data/useRootData";
import { Link, useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import UrlUtils from "~/utils/app/UrlUtils";
import { GearIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import CreditsRemaining from "~/modules/usage/components/CreditsRemaining";
import CurrentSubscriptionButton from "../../buttons/CurrentSubscriptionButton";
import { Inbox } from "@novu/react";
import Modal from "~/components/ui/modals/Modal";
import SaasRockProFeature from "~/components/ui/misc/SaasRockProFeature";
import StarsIconFilled from "~/components/ui/icons/StarsIconFilled";
import ThemeSelector from "~/components/ui/selectors/ThemeSelector";
import { useAppData } from "~/utils/data/useAppData";
import ProfileButton from "../../buttons/ProfileButton";
import QuickActionsButton from "../../buttons/QuickActionsButton";
import OnboardingButton from "../../buttons/OnboardingButton";

export function NavActions({
  layout,
  onOpenCommandPalette,
  setOnboardingModalOpen,
}: {
  layout: "admin" | "app" | "docs";
  onOpenCommandPalette: () => void;
  setOnboardingModalOpen: (value: boolean) => void;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // const title = useTitleData() ?? "";

  const appOrAdminData = useAppOrAdminData();
  const appData = useAppData();
  const rootData = useRootData();
  const appConfiguration = rootData.appConfiguration;
  const params = useParams();

  const [isOpen, setIsOpen] = React.useState(false);

  function hasSubscription() {
    const myProducts = appData?.mySubscription?.products.map((f) => t(f.subscriptionProduct.title)) ?? [];
    return myProducts.length > 0;
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      {false && (
        <NavBar
          layout={layout}
          // title={title}
          buttons={{
            mySubscription: getUserHasPermission(appOrAdminData, "app.settings.subscription.update"),
            linkedAccounts: getUserHasPermission(appOrAdminData, "app.settings.linkedAccounts.view"),
            feedback: rootData.appConfiguration.app.features.tenantFeedback,
            chatSupport: !!rootData.chatWebsiteId,
            quickActions: appOrAdminData?.entities?.filter((f) => f.showInSidebar).length > 0,
            search: true,
            notifications: appConfiguration.notifications.enabled && (layout === "admin" || layout === "app"),
            onboarding: appConfiguration.onboarding.enabled,
            userProfile: false,
          }}
          onOpenCommandPalette={onOpenCommandPalette}
          onOpenOnboardingModal={() => setOnboardingModalOpen(true)}
        ></NavBar>
      )}

      <div className="flex items-center space-x-2 md:ml-6">
        {appConfiguration.onboarding.enabled && appOrAdminData?.onboardingSession && (
          <OnboardingButton item={appOrAdminData?.onboardingSession} onClick={() => setOnboardingModalOpen(true)} />
        )}

        {/* NavBar Button: My Subscription */}
        {layout === "app" && getUserHasPermission(appOrAdminData, "app.settings.subscription.update") && (
          <React.Fragment>
            {!hasSubscription() && (
              <Link to={!params.tenant ? "" : "/subscribe/" + params.tenant}>
                <Button variant="outline" size="sm">
                  <span>{t("pricing.subscribe")} </span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Button>
              </Link>
            )}
          </React.Fragment>
        )}

        {/* NavBar Button: Notifications */}
        {appConfiguration.notifications.enabled && (layout === "admin" || layout === "app") && appOrAdminData?.user && (
          <Inbox
            applicationIdentifier={rootData?.appConfiguration.notifications.novuAppId || ""}
            subscriberId={appOrAdminData?.user.id || ""}
            routerPush={(path: string) => navigate(path)}
            appearance={{ elements: { popoverTrigger: { padding: "0rem" } } }}
            renderBell={(unreadCount) => (
              <div>
                {/* <NotificationsButton unseenCount={unreadCount} /> */}
                <Button variant="ghost" size="sm" className="text-muted-foreground relative">
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {unreadCount?.toString() !== "0" && (
                    <span className="absolute inset-0 -mr-6 object-right-top">
                      <div className="inline-flex items-center rounded-full border-2 border-white bg-red-500 px-1.5 py-0.5 text-xs font-semibold leading-4 text-white">
                        {unreadCount}
                      </div>
                    </span>
                  )}
                </Button>
              </div>
            )}
          ></Inbox>
        )}

        {/* NavBar Button: Search */}
        <Button variant="ghost" size="icon" onClick={onOpenCommandPalette} className="text-muted-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </Button>

        {/* NavBar Button: Feedback */}
        {appConfiguration.app.features.tenantFeedback && layout === "app" && <AddFeedbackButton />}

        {/* NavBar Button: Chat Support */}
        {(layout === "app" || layout === "admin") && !!rootData.chatWebsiteId && (
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground"
            onClick={() => {
              try {
                // @ts-ignore
                $crisp?.push(["do", "chat:open"]);
                // @ts-ignore
                $crisp?.push(["do", "chat:show"]);
              } catch (e) {
                // ignore
              }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </Button>
        )}

        {/* NavBar Button: Profile */}
        {/* {(layout === "app" || layout === "admin") && <ProfileButton user={appOrAdminData?.user} layout={layout} />} */}

        {/* NavBar Button: Theme Selector */}
        {/* {rootData.debug && <ThemeSelector variant="secondary" />} */}

        {/* NavBar Button: Quick Actions */}
        {/* {layout === "app" && <QuickActionsButton entities={appOrAdminData?.entities?.filter((f) => f.showInSidebar)} />} */}

        {/* NavBar Button: More */}
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="data-[state=open]:bg-accent h-7 w-7">
              <MoreHorizontal className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 overflow-hidden rounded-lg p-0" align="end">
            <Sidebar collapsible="none" className="bg-transparent">
              <SidebarContent>
                {layout === "app" ? (
                  <SidebarGroup className="border-b last:border-none">
                    <SidebarGroupContent className="gap-0">
                      <SidebarMenu>
                        <SidebarMenuItem>
                          <Link to={!params.tenant ? "" : UrlUtils.currentTenantUrl(params, `settings/profile`)}>
                            <SidebarMenuButton>
                              <GearIcon className="mr-2 h-4 w-4" />
                              {t("app.navbar.profile")}
                            </SidebarMenuButton>
                          </Link>
                        </SidebarMenuItem>

                        <SidebarMenuItem>
                          <Link to={UrlUtils.currentTenantUrl(params, `settings/subscription`)}>
                            <SidebarMenuButton>
                              <CreditCard className="mr-2 h-4 w-4" />
                              {t("app.navbar.subscription")}
                            </SidebarMenuButton>
                          </Link>
                        </SidebarMenuItem>
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                ) : layout === "admin" ? (
                  <SidebarGroup className="border-b last:border-none">
                    <SidebarGroupContent className="gap-0">
                      <SidebarMenu>
                        <SidebarMenuItem>
                          <Link to="/admin/settings/profile">
                            <SidebarMenuButton>
                              <GearIcon className="mr-2 h-4 w-4" />
                              {t("app.navbar.profile")}
                            </SidebarMenuButton>
                          </Link>
                        </SidebarMenuItem>
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                ) : null}

                <SidebarGroup className="border-b last:border-none">
                  <SidebarGroupContent className="gap-0">
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <Link to="/logout">
                          <SidebarMenuButton>
                            <LogOut className="mr-2 h-4 w-4" />
                            {t("app.navbar.signOut")}
                          </SidebarMenuButton>
                        </Link>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

function AddFeedbackButton() {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <React.Fragment>
      <Button onClick={() => setIsOpen(!isOpen)} variant="ghost" size="icon" className="text-muted-foreground">
        <span className="sr-only">Feedback</span>
        <StarsIconFilled className="h-5 w-5 p-0.5" />
      </Button>
      <Modal open={isOpen} setOpen={setIsOpen} size="sm">
        <SaasRockProFeature />
      </Modal>
    </React.Fragment>
  );
}
