// @@@ pwned by 1m4unkn0wn @@@
import { useLocation } from "react-router";
import { CookieCategory } from "~/application/cookies/CookieCategory";
import { useRootData } from "~/utils/data/useRootData";
import CookieHelper from "~/utils/helpers/CookieHelper";

export default function ScriptAnalytics() {
  const rootData = useRootData();
  const location = useLocation();
  if (!rootData.appConfiguration?.analytics.enabled) {
    return null;
  }
  if (["/app/", "/admin/"].some((p) => location.pathname.startsWith(p))) {
    return null;
  }
  return (
    <>
      {rootData.appConfiguration?.analytics.simpleAnalytics && (
        <>
          <script async defer src="https://scripts.simpleanalyticscdn.com/latest.js"></script>
          <noscript>
            <img src="https://queue.simpleanalyticscdn.com/noscript.gif" alt="privacy-friendly-simpleanalytics" referrerPolicy="no-referrer-when-downgrade" />
          </noscript>
        </>
      )}

      {rootData.appConfiguration?.analytics.plausibleAnalytics && (
        <>
          <script defer data-domain={rootData.domainName} src="https://plausible.io/js/script.js"></script>
        </>
      )}

      {CookieHelper.hasConsent(rootData.userSession, CookieCategory.ADVERTISEMENT) && (
        <>
          {rootData.appConfiguration?.analytics.googleAnalyticsTrackingId && (
            <>
              <script async src={`https://www.googletagmanager.com/gtag/js?id=${rootData.appConfiguration?.analytics.googleAnalyticsTrackingId}`} />
              <script
                async
                id="gtag-init"
                dangerouslySetInnerHTML={{
                  __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${rootData.appConfiguration?.analytics.googleAnalyticsTrackingId}', {
                  page_path: window.location.pathname,
                });
              `,
                }}
              />
            </>
          )}
        </>
      )}
    </>
  );
}
