// @@@ pwned by 1m4unkn0wn @@@
import { useLocation } from "react-router";
import UrlUtils from "../app/UrlUtils";

export default function useRouteUtils() {
  const location = useLocation();
  const parentRoute = UrlUtils.getParentRoute(location.pathname);
  return {
    parentRoute,
  };
}
