// @@@ pwned by 1m4unkn0wn @@@
import { Fragment, useRef, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, TransitionChild } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import NewTenantSelect from "./selectors/NewTenantSelect";
import { useRootData } from "~/utils/data/useRootData";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import { useAppOrAdminData } from "~/utils/data/useAppOrAdminData";
import { getUserHasPermission } from "~/utils/helpers/PermissionsHelper";
import AddFeedbackButton from "./buttons/AddFeedbackButton";
import ChatSupportButton from "./buttons/ChatSupportButton";
import CurrentSubscriptionButton from "./buttons/CurrentSubscriptionButton";
import LinkedAccountsButton from "./buttons/LinkedAccountsButton";
import OnboardingButton from "./buttons/OnboardingButton";
import ProfileButton from "./buttons/ProfileButton";
import QuickActionsButton from "./buttons/QuickActionsButton";
import SearchButton from "./buttons/SearchButton";
import { useTitleData } from "~/utils/data/useTitleData";
import OnboardingSession from "~/modules/onboarding/components/OnboardingSession";
import clsx from "clsx";
import Logo from "../brand/Logo";
import { AdminSidebar } from "~/application/sidebar/AdminSidebar";
import { AppSidebar } from "~/application/sidebar/AppSidebar";
import { DocsSidebar } from "~/application/sidebar/DocsSidebar";
import { SidebarGroupDto } from "~/application/sidebar/SidebarGroupDto";
import { SideBarItem } from "~/application/sidebar/SidebarItem";
import UrlUtils from "~/utils/app/UrlUtils";
import SidebarIcon from "./icons/SidebarIcon";
import { useAppData } from "~/utils/data/useAppData";
import { useAdminData } from "~/utils/data/useAdminData";
import { useTranslation } from "react-i18next";
import NewTenantSelector from "./selectors/NewTenantSelector";
import LogoDark from "~/assets/img/logo-dark.png";
import LogoLight from "~/assets/img/logo-light.png";
import { Inbox } from "@novu/react";
import NotificationsButton from "./buttons/NotificationsButton";
import NavBar from "./NavBar";

function classNames(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

interface Props {
  layout: "app" | "admin" | "docs";
  children: React.ReactNode;
  onOpenCommandPalette: () => void;
  menuItems?: SideBarItem[];
}
export default function NewSidebarMenu({ layout, children, onOpenCommandPalette, menuItems }: Props) {
  const { t } = useTranslation();
  const rootData = useRootData();
  const appData = useAppData();
  const adminData = useAdminData();
  const appOrAdminData = useAppOrAdminData();
  const appConfiguration = rootData.appConfiguration;
  const location = useLocation();
  const params = useParams();
  const title = useTitleData() ?? "";

  const mainElement = useRef<HTMLElement>(null);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [onboardingModalOpen, setOnboardingModalOpen] = useState(false);

  const getMenuItems = () => {
    let menu: SideBarItem[] = [];
    if (menuItems) {
      menu = menuItems;
    } else if (layout === "admin") {
      menu = AdminSidebar({ t, appConfiguration: rootData.appConfiguration });
    } else if (layout === "app") {
      menu = AppSidebar({
        t,
        tenantId: params.tenant ?? "",
        entities: appData?.entities ?? [],
        entityGroups: appData?.entityGroups ?? [],
        appConfiguration: rootData.appConfiguration,
      });
    } else if (layout === "docs") {
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

  const [expanded, setExpanded] = useState<string[]>([]);

  function menuItemIsExpanded(path: string) {
    return expanded.includes(path);
  }
  function toggleMenuItem(path: string) {
    if (expanded.includes(path)) {
      setExpanded(expanded.filter((item) => item !== path));
    } else {
      setExpanded([...expanded, path]);
    }
  }
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
    return !item.permission || appData?.permissions?.includes(item.permission) || adminData?.permissions?.includes(item.permission);
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
      .forEach(({ title, items }) => {
        _menu.push({
          title: title.toString(),
          items:
            items
              ?.filter((f) => filterItem(f))
              .map((f) => {
                return {
                  ...f,
                  items: f.items?.filter((f) => filterItem(f)),
                };
              }) ?? [],
        });
      });
    return _menu.filter((f) => f.items.length > 0);
  };

  function onSelected() {
    setSidebarOpen(false);
  }

  return (
    <>
      <div>
        <OnboardingSession open={onboardingModalOpen} setOpen={setOnboardingModalOpen} />

        <Dialog
          open={sidebarOpen}
          onClose={setSidebarOpen}
          className={clsx(
            "text-foreground relative z-50 lg:hidden",

            layout === "admin" ? "dark" : "dark"
          )}
        >
          <DialogBackdrop transition className="bg-foreground/50 fixed inset-0 transition-opacity duration-300 ease-linear data-[closed]:opacity-0" />

          <div className="fixed inset-0 flex">
            <DialogPanel
              transition
              className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-[closed]:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute left-full top-0 flex w-16 justify-center pt-5 duration-300 ease-in-out data-[closed]:opacity-0">
                  <button type="button" onClick={() => setSidebarOpen(false)} className="-m-2.5 p-2.5">
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon aria-hidden="true" className="h-6 w-6 text-white" />
                  </button>
                </div>
              </TransitionChild>
              {/* Sidebar component, swap this element with another sidebar if you like */}
              <div className="bg-background flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-4 ring-1 ring-white/10">
                <div className="flex h-16 shrink-0 items-center">
                  {/* <img alt="Your Company" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500" className="h-8 w-auto" /> */}

                  <Link to={"/"}>
                    <Logo size="h-8 p-1 w-auto" />
                  </Link>
                </div>
                <nav className="flex flex-1 flex-col">
                  {layout === "app" && <div>{appData?.currentTenant && <NewTenantSelector key={params.tenant} />}</div>}

                  {getMenu().map((group, index) => {
                    return (
                      <div key={index} className="space-y-1">
                        <div id={group.title} className="mt-1">
                          <h3 className="text-muted-foreground px-1 text-xs font-medium uppercase leading-4 tracking-wider">{t(group.title || "")}</h3>
                        </div>
                        {group.items.map((menuItem, index) => {
                          return (
                            <Link
                              key={index}
                              prefetch="intent"
                              id={UrlUtils.slugify(getPath(menuItem))}
                              to={menuItem.redirectTo ?? getPath(menuItem)}
                              className={clsx(
                                isCurrent(menuItem)
                                  ? "bg-secondary text-primary dark:text-secondary-foreground"
                                  : "hover:bg-secondary hover:text-secondary-foreground text-secondary-foreground/70",
                                "group flex gap-x-3 rounded-md p-2 text-sm leading-5"
                              )}
                              onClick={onSelected}
                            >
                              {(menuItem.icon !== undefined || menuItem.entityIcon !== undefined) && <SidebarIcon className="h-5 w-5 " item={menuItem} />}
                              <div>{t(menuItem.title)}</div>
                            </Link>
                          );
                        })}
                      </div>
                    );
                  })}
                  <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    {/* <li>
                      <ul role="list" className="-mx-2 space-y-1">
                        {navigation.map((item) => (
                          <li key={item.name}>
                            <a
                              href={item.href}
                              className={classNames(
                                item.current ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white",
                                "group flex gap-x-3 rounded-md p-2 text-sm leading-5"
                              )}
                            >
                              <item.icon aria-hidden="true" className="h-6 w-6 shrink-0" />
                              {item.name}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li> */}
                    {/* <li>
                      <div className="text-xs font-medium leading-6 text-gray-400">Your teams</div>
                      <ul role="list" className="-mx-2 mt-2 space-y-1">
                        {teams.map((team) => (
                          <li key={team.name}>
                            <a
                              href={team.href}
                              className={classNames(
                                team.current ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white",
                                "group flex gap-x-3 rounded-md p-2 text-sm leading-5"
                              )}
                            >
                              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                                {team.initial}
                              </span>
                              <span className="truncate">{team.name}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li> */}
                    <li className="mt-auto">
                      {layout == "app" && <NewTenantSelect onOpenCommandPalette={onOpenCommandPalette} />}
                      {/* <a
                        href="#"
                        className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm leading-5 text-gray-400 hover:bg-gray-800 hover:text-white"
                      >
                        <Cog6ToothIcon aria-hidden="true" className="h-6 w-6 shrink-0" />
                        Settings
                      </a> */}
                    </li>
                  </ul>
                </nav>
              </div>
            </DialogPanel>
          </div>
        </Dialog>

        {/* Static sidebar for desktop */}
        <div
          className={clsx(
            "text-foreground hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col",

            layout === "admin" ? "dark" : "dark"
          )}
        >
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="bg-background border-border flex grow flex-col overflow-y-auto border-r px-6 pb-4 shadow-sm dark:border-r-0">
            <div className="flex h-16 shrink-0 items-center justify-center border-b border-transparent">
              <Link to={"/"}>
                {/* <Logo size="h-8 p-1 w-auto" /> */}
                <img
                  className={"mx-auto hidden h-10 w-auto p-1 dark:flex"}
                  src={appConfiguration.branding.logoDarkMode || appConfiguration.branding.logo || LogoDark}
                  alt="Logo"
                />
                <img
                  className={"mx-auto h-10 w-auto p-1 dark:hidden"}
                  src={appConfiguration.branding.logoDarkMode || appConfiguration.branding.logo || LogoLight}
                  alt="Logo"
                />
              </Link>
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {layout === "app" && <div>{appData?.currentTenant && <NewTenantSelector key={params.tenant} />}</div>}

                    {getMenu().map((group, index) => {
                      return (
                        <div key={index} className="select-none">
                          <div className="mt-2">
                            <h3 id="Group-headline" className="text-muted-foreground px-1 text-xs font-medium uppercase leading-4 tracking-wider">
                              {t(group.title || "")}
                            </h3>
                          </div>
                          {group.items.map((menuItem, index) => {
                            return (
                              <div key={index}>
                                {(() => {
                                  if (!menuItem.items || menuItem.items.length === 0) {
                                    return (
                                      <Link
                                        prefetch="intent"
                                        id={UrlUtils.slugify(getPath(menuItem))}
                                        to={menuItem.redirectTo ?? getPath(menuItem)}
                                        className={clsx(
                                          "group mt-1 flex items-center justify-between truncate rounded-sm px-4 py-2 text-sm leading-5 transition duration-150 ease-in-out  focus:outline-none",
                                          menuItem.icon !== undefined && "px-4",
                                          isCurrent(menuItem)
                                            ? "bg-secondary text-primary dark:text-secondary-foreground"
                                            : "hover:bg-secondary hover:text-secondary-foreground text-secondary-foreground/70",
                                          "group flex gap-x-3 rounded-md p-2 text-sm leading-5"
                                        )}
                                        onClick={onSelected}
                                      >
                                        <div className="flex items-center space-x-5">
                                          {(menuItem.icon !== undefined || menuItem.entityIcon !== undefined) && (
                                            <SidebarIcon className="h-5 w-5 " item={menuItem} />
                                          )}
                                          <div>{t(menuItem.title)}</div>
                                        </div>
                                        {menuItem.side}
                                      </Link>
                                    );
                                  } else {
                                    return (
                                      <div>
                                        <button
                                          type="button"
                                          className={clsx(
                                            "group mt-1 flex w-full items-center justify-between truncate rounded-sm px-4 py-2 text-sm leading-5 transition duration-150 ease-in-out  focus:outline-none",
                                            menuItem.icon !== undefined && "px-4",
                                            isCurrent(menuItem)
                                              ? "bg-secondary text-primary dark:text-secondary-foreground"
                                              : "hover:bg-secondary hover:text-secondary-foreground text-secondary-foreground/70",
                                            "group flex gap-x-3 rounded-md p-2 text-sm leading-5"
                                          )}
                                          onClick={() => toggleMenuItem(menuItem.path)}
                                        >
                                          <div className="flex items-center space-x-5 truncate">
                                            {(menuItem.icon !== undefined || menuItem.entityIcon !== undefined) && (
                                              <SidebarIcon className="h-5 w-5 " item={menuItem} />
                                            )}
                                            <div className="truncate">{t(menuItem.title)}</div>
                                          </div>
                                          {/*Expanded: "text-gray-400 rotate-90", Collapsed: "text-slate-200" */}

                                          {menuItem.side ?? (
                                            <svg
                                              className={clsx(
                                                "ml-auto h-5 w-5 flex-shrink-0 transform transition-colors duration-150 ease-in-out",
                                                menuItemIsExpanded(menuItem.path)
                                                  ? "ml-auto h-3 w-3 rotate-90 transform  transition-colors duration-150 ease-in-out"
                                                  : "ml-auto h-3 w-3 transform  transition-colors duration-150 ease-in-out"
                                              )}
                                              viewBox="0 0 20 20"
                                            >
                                              <path d="M6 6L14 10L6 14V6Z" fill="currentColor" />
                                            </svg>
                                          )}
                                        </button>

                                        {/*Expandable link section, show/hide based on state. */}
                                        {menuItemIsExpanded(menuItem.path) && (
                                          <div className="mt-1">
                                            {menuItem.items.map((subItem, index) => {
                                              return (
                                                <Fragment key={index}>
                                                  <Link
                                                    prefetch="intent"
                                                    id={UrlUtils.slugify(getPath(subItem))}
                                                    to={subItem.redirectTo ?? getPath(subItem)}
                                                    className={clsx(
                                                      "group mt-1 flex items-center rounded-sm py-2 text-sm leading-5 transition duration-150 ease-in-out  focus:outline-none",
                                                      menuItem.icon === undefined && "pl-10",
                                                      menuItem.icon !== undefined && "pl-14",
                                                      isCurrent(menuItem)
                                                        ? "bg-secondary text-primary dark:text-secondary-foreground"
                                                        : "hover:bg-secondary hover:text-secondary-foreground text-secondary-foreground/70",
                                                      "group flex gap-x-3 rounded-md p-2 text-sm leading-5"
                                                    )}
                                                    onClick={onSelected}
                                                  >
                                                    {(subItem.icon !== undefined || subItem.entityIcon !== undefined) && (
                                                      <SidebarIcon className="h-5 w-5 " item={subItem} />
                                                    )}
                                                    <div>{t(subItem.title)}</div>
                                                  </Link>
                                                </Fragment>
                                              );
                                            })}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  }
                                })()}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                    {/* {navigation.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={classNames(
                            item.current ? " bg-secondary text-primary dark:text-secondary-foreground" : "hover:text-primary text-muted-foreground hover:bg-gray-50",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-5"
                          )}
                        >
                          <item.icon
                            aria-hidden="true"
                            className={classNames(item.current ? "text-primary" : "group-hover:text-primary text-gray-400", "h-6 w-6 shrink-0")}
                          />
                          {item.name}
                        </a>
                      </li>
                    ))} */}
                  </ul>
                </li>
                {/* <li>
                  <div className="text-xs font-medium leading-6 text-gray-400">Your teams</div>
                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {teams.map((team) => (
                      <li key={team.name}>
                        <a
                          href={team.href}
                          className={classNames(
                            team.current ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-5"
                          )}
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-[0.625rem] font-medium text-gray-400 group-hover:text-white">
                            {team.initial}
                          </span>
                          <span className="truncate">{team.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </li> */}
                <li className="mt-auto">
                  {layout == "app" && <NewTenantSelect onOpenCommandPalette={onOpenCommandPalette} />}

                  {/* <a
                    href="#"
                    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm leading-5 text-gray-400 hover:bg-gray-800 hover:text-white"
                  >
                    <Cog6ToothIcon aria-hidden="true" className="h-6 w-6 shrink-0" />
                    Settings
                  </a> */}
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="lg:pl-64">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button type="button" onClick={() => setSidebarOpen(true)} className="text-muted-foreground -m-2.5 p-2.5 lg:hidden">
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon aria-hidden="true" className="h-6 w-6" />
            </button>

            {/* Separator */}
            <div aria-hidden="true" className="bg-foreground/10 h-6 w-px lg:hidden" />

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <NavBar
                layout={layout}
                title={title}
                buttons={{
                  mySubscription: getUserHasPermission(appOrAdminData, "app.settings.subscription.update"),
                  linkedAccounts: getUserHasPermission(appOrAdminData, "app.settings.linkedAccounts.view"),
                  feedback: rootData.appConfiguration.app.features.tenantFeedback,
                  chatSupport: !!rootData.chatWebsiteId,
                  quickActions: appOrAdminData?.entities?.filter((f) => f.showInSidebar).length > 0,
                  search: true,
                  notifications: appConfiguration.notifications.enabled && (layout === "admin" || layout === "app"),
                  onboarding: appConfiguration.onboarding.enabled,
                  userProfile: true,
                }}
                onOpenCommandPalette={onOpenCommandPalette}
                onOpenOnboardingModal={() => setOnboardingModalOpen(true)}
              />
            </div>
          </div>

          <main ref={mainElement} className="flex-1 bg-gray-50 focus:outline-none" tabIndex={0}>
            <div key={params.tenant} className="pb-20 sm:pb-0">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
