// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunction, redirect } from "react-router";
import ServerError from "~/components/ui/errors/ServerError";
import { getAuthenticator } from "~/utils/auth/auth.server";

export const loader = () => redirect("/login");

export let action: ActionFunction = ({ request }) => {
  return getAuthenticator(request).authenticate("google", request);
};

export function ErrorBoundary() {
  return <ServerError />;
}
