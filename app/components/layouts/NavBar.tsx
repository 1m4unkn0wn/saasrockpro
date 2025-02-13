// @@@ pwned by 1m4unkn0wn @@@
import { useNavigate } from "react-router";
import { useAppOrAdminData } from "~/utils/data/useAppOrAdminData";
import { useRootData } from "~/utils/data/useRootData";
import AddFeedbackButton from "./buttons/AddFeedbackButton";
import ChatSupportButton from "./buttons/ChatSupportButton";
import CurrentSubscriptionButton from "./buttons/CurrentSubscriptionButton";
import LinkedAccountsButton from "./buttons/LinkedAccountsButton";
import OnboardingButton from "./buttons/OnboardingButton";
import ProfileButton from "./buttons/ProfileButton";
import QuickActionsButton from "./buttons/QuickActionsButton";
import SearchButton from "./buttons/SearchButton";
import { Inbox } from "@novu/react";
import NotificationsButton from "./buttons/NotificationsButton";

export default function NavBar({
  layout,
  title,
  buttons,
  onOpenCommandPalette,
  onOpenOnboardingModal,
  children,
}: {
  layout?: string;
  title?: string;
  buttons: {
    mySubscription: boolean;
    linkedAccounts: boolean;
    feedback: boolean;
    chatSupport: boolean;
    quickActions: boolean;
    search: boolean;
    notifications: boolean;
    onboarding: boolean;
    userProfile: boolean;
  };
  onOpenCommandPalette: () => void;
  onOpenOnboardingModal: () => void;
  children?: React.ReactNode;
}) {
  const appOrAdminData = useAppOrAdminData();
  const rootData = useRootData();
  const navigate = useNavigate();
  return (
    <div className="flex flex-1 justify-between space-x-2">
      <div className="flex flex-1 items-center">{title && <div className="font-extrabold ">{title}</div>}</div>
      <div className="flex items-center space-x-2 md:ml-6">
        {/* {layout === "app" && (
          <CreditsRemaining
            feature={appOrAdminData.featureSyncs}
            redirectTo={appOrAdminData.currentTenant ? `/app/${appOrAdminData.currentTenant.slug}/settings/subscription` : "/settings/subscription"}
          />
        )} */}
        {buttons.onboarding && appOrAdminData?.onboardingSession && (
          <OnboardingButton item={appOrAdminData?.onboardingSession} onClick={onOpenOnboardingModal} />
        )}
        {layout === "app" && buttons.mySubscription && <CurrentSubscriptionButton />}
        {/* <LocaleSelector /> */}
        {buttons.notifications && appOrAdminData?.user && (
          <Inbox
            applicationIdentifier={rootData?.appConfiguration.notifications.novuAppId || ""}
            subscriberId={appOrAdminData?.user.id || ""}
            routerPush={(path: string) => navigate(path)}
            appearance={{ elements: { popoverTrigger: { padding: "0rem" } } }}
            renderBell={(unreadCount) => (
              <div>
                <NotificationsButton unseenCount={unreadCount} />
              </div>
            )}
          ></Inbox>
        )}
        {buttons.search && <SearchButton onClick={onOpenCommandPalette} />}
        {layout === "app" && buttons.feedback && <AddFeedbackButton />}
        {layout === "app" && buttons.linkedAccounts && <LinkedAccountsButton />}
        {layout === "app" && buttons.chatSupport && <ChatSupportButton />}
        {layout === "app" && buttons.quickActions && <QuickActionsButton entities={appOrAdminData?.entities?.filter((f) => f.showInSidebar)} />}
        {/* {(layout === "app" || layout === "admin") && <ThemeSelector variant="secondary" />} */}
        {(layout === "app" || layout === "admin") && buttons.userProfile && <ProfileButton user={appOrAdminData?.user} layout={layout} />}
        {children}
      </div>
    </div>
  );
}
