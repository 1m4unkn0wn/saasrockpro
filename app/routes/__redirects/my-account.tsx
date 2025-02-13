// @@@ pwned by 1m4unkn0wn @@@
import { LoaderFunction, redirect } from "react-router";
import { getMyTenants } from "~/utils/db/tenants.db.server";
import { getUser } from "~/utils/db/users.db.server";
import { getUserInfo } from "~/utils/session.server";

let redirectTo = "settings/account";
export const loader: LoaderFunction = async ({ request }) => {
  const userInfo = await getUserInfo(request);
  const user = await getUser(userInfo.userId);
  if (!user) {
    throw redirect(`/login?redirect=${encodeURIComponent(new URL(request.url).pathname)}`);
  }
  const myTenants = await getMyTenants(userInfo.userId);
  if (myTenants.length === 0 && user.admin) {
    return redirect("/admin");
  } else if (myTenants.length > 0) {
    try {
      return redirect("/app/" + encodeURIComponent(myTenants[0].slug) + "/" + redirectTo);
    } catch (e) {}
  }
  return redirect("/app");
};
