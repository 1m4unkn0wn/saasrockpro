// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunction, LoaderFunctionArgs, useSearchParams } from "react-router";
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useActionData, useLoaderData, useLocation, useMatches } from "react-router";
import "./globals.css";
import "./themes.css";
import { createUserSession, getUserInfo } from "./utils/session.server";
import { AppRootData, useRootData } from "./utils/data/useRootData";
import { loadRootData } from "./utils/data/.server/rootData";
import FloatingLoader from "./components/ui/loaders/FloatingLoader";
import CookieConsentBanner from "./components/cookies/CookieConsentBanner";
import { allCookieCategories } from "./application/cookies/ApplicationCookies";
import { CookieCategory } from "./application/cookies/CookieCategory";
import { Fragment, useEffect, useState } from "react";
import AnalyticsHelper from "./utils/helpers/AnalyticsHelper";
import CookieHelper from "./utils/helpers/CookieHelper";
import clsx from "clsx";
import { getUser, updateUserProfile } from "./utils/db/users.db.server";
import ServerError from "./components/ui/errors/ServerError";
import PageMaintenanceMode from "./components/pages/PageMaintenanceMode";
import FeatureFlagTracker from "./modules/featureFlags/components/FeatureFlagTracker";
import { serverTimingHeaders } from "./modules/metrics/utils/defaultHeaders.server";
import BannerBlock from "./modules/pageBlocks/components/blocks/marketing/banner/BannerBlock";
import { useTranslation } from "react-i18next";
import { Toaster as ReactHostToaster } from "react-hot-toast";
import { Toaster as SonnerToaster } from "./components/ui/sonner";
import { useChangeLanguage } from "remix-i18next/react";
import EventsService from "./modules/events/services/.server/EventsService";
import { UserPreferencesUpdatedDto } from "./modules/events/dtos/UserPreferencesUpdatedDto";
import AuthService from "./modules/users/services/AuthService";
import ScriptInjector from "./modules/shared/scripts/ScriptInjector";
import ScriptRewardful from "./modules/shared/scripts/ScriptRewardful";
import ScriptCrisp from "./modules/shared/scripts/ScriptCrisp";
import ScriptAnalytics from "./modules/shared/scripts/ScriptAnalytics";
import { v2MetaFunction } from "./utils/compat/v2MetaFunction";
export { serverTimingHeaders as headers };

export const handle = { i18n: "translations" };
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  return loadRootData({ request, params });
};

export const meta: v2MetaFunction<AppRootData> = ({ data }) => data?.metatags ?? [];

function Document({ children, lang = "en", dir = "ltr" }: { children: React.ReactNode; lang?: string; dir?: string }) {
  const { t } = useTranslation();
  const location = useLocation();
  const rootData = useRootData();
  const [lastLocation, setLastLocation] = useState("");
  const matches = useMatches();
  const actionData = useActionData();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (lastLocation == location.pathname) {
      return;
    }
    const routeMatch = matches.find((m) => m.pathname == location.pathname);
    setLastLocation(location.pathname);

    async function addView() {
      let params = searchParams ? "?" + searchParams.toString() : "";
      AnalyticsHelper.addPageView({
        url: location.pathname + params,
        route: routeMatch?.id,
        rootData,
      });
    }
    addView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastLocation, location, rootData, actionData]);

  return (
    <html
      lang={lang}
      dir={dir}
      key={rootData.userSession?.lng}
      className={
        // ["/app/", "/admin/"] don't apply the dark theme
        ["/app/", "/admin/"].some((p) => location.pathname.startsWith(p)) ? "" : rootData.userSession?.lightOrDarkMode === "dark" ? "dark" : ""
      }
    >
      <head>
        <Meta />
        {rootData.appConfiguration?.branding?.favicon ? (
          <link rel="icon" href={rootData.appConfiguration?.branding?.favicon} />
        ) : (
          <>
            <link rel="icon" type="image/png" sizes="192x192" href="/android-icon-192x192.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
          </>
        )}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        {rootData.appConfiguration?.reviews?.trustpilot && (
          <script type="text/javascript" src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js" async></script>
        )}
        {rootData.appConfiguration?.auth.recaptcha.enabled && <script src="https://www.google.com/recaptcha/api.js" async defer></script>}
        <ScriptRewardful />

        <Links />
      </head>

      <body
        className={clsx(
          `theme-${rootData.theme}`,
          "text-foreground max-h-full min-h-screen max-w-full",
          ["app/", "admin/"].some((p) => location.pathname.startsWith(`/${p}`)) ? "bg-gray-50" : ""
        )}
      >
        {rootData.impersonatingSession && (
          <BannerBlock
            item={{
              style: "top",
              text: t("account.session.impersonating", { 0: rootData.impersonatingSession.toUser.email, 1: rootData.impersonatingSession.fromUser.email }),
              cta: [{ text: t("account.session.logout"), href: "/logout" }],
            }}
          />
        )}
        {rootData.featureFlags?.includes("maintenance") && !location.pathname.startsWith("/admin") && !location.pathname.startsWith("/login") ? (
          <FeatureFlagTracker flag="maintenance">
            <PageMaintenanceMode />
          </FeatureFlagTracker>
        ) : (
          children
        )}
        <ScriptCrisp />
        <ScriptAnalytics />
        {!["app/", "admin/"].some((p) => location.pathname.startsWith(`/${p}`)) && <CookieConsentBanner />}
        <FloatingLoader />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const userInfo = await getUserInfo(request);
  const form = await request.formData();
  const action = form.get("action");
  const redirect = form.get("redirect")?.toString();
  if (action === "toggleLightOrDarkMode") {
    const current = userInfo.lightOrDarkMode ?? "dark";
    const lightOrDarkMode = current === "dark" ? "light" : "dark";
    return createUserSession(
      {
        ...userInfo,
        lightOrDarkMode,
      },
      redirect
    );
  }
  if (action === "setLocale") {
    const lng = form.get("lng")?.toString() ?? "";
    if (userInfo.userId) {
      const user = await getUser(userInfo.userId);
      if (user) {
        await updateUserProfile({ locale: lng }, user.id);
        await EventsService.create({
          request,
          event: "user.preferences.updated",
          tenantId: null,
          userId: user.id,
          data: {
            old: { locale: user.locale ?? "" },
            new: { locale: lng },
            user: { id: user.id, email: user.email },
          } satisfies UserPreferencesUpdatedDto,
        });
      }
    }
    return createUserSession(
      {
        ...userInfo,
        lng,
      },
      redirect
    );
  }
  if (action === "setCookieConsent") {
    const preserveParams = ["ref", "source", "utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
    const allowed = form.getAll("cookies[]").map((f) => f.toString());
    const cookies: { category: string; allowed: boolean }[] = [];
    allCookieCategories.forEach((item) => {
      const categoryName = CookieCategory[item];
      const isAllowed = allowed.filter((f) => f.toString() === categoryName.toString()).length > 0;
      cookies.push({ category: CookieCategory[item], allowed: isAllowed ?? item === CookieCategory.REQUIRED });
    });
    const searchParams = new URLSearchParams();
    preserveParams.forEach((param) => {
      const value = form.get(param)?.toString();
      if (value) {
        searchParams.set(param, value);
      }
    });
    return createUserSession(
      {
        ...userInfo,
        cookies,
      },
      redirect + "?" + searchParams.toString()
    );
  }
  if (action === "login") {
    return await AuthService.loginFromRequest(request, form);
  }
  if (action === "setTheme") {
    const theme = form.get("theme")?.toString();
    if (!theme) {
      return Response.json({ error: "Invalid theme" });
    }
    return createUserSession({ ...userInfo, theme }, redirect);
  }
};

export default function App() {
  const { locale } = useLoaderData<AppRootData>();
  const { i18n } = useTranslation();
  const rootData = useRootData();
  useChangeLanguage(locale);
  return (
    <Document lang={locale} dir={i18n.dir()}>
      <Outlet />
      <ReactHostToaster />
      <SonnerToaster />
      <ScriptInjector scripts={rootData.appConfiguration?.scripts} />
    </Document>
  );
}

export function ErrorBoundary() {
  return (
    <Document>
      <div className="mx-auto p-12 text-center">
        <ServerError />
      </div>
    </Document>
  );
}
