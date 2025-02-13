// @@@ pwned by 1m4unkn0wn @@@
import { LoaderFunctionArgs } from "react-router";
import Page404 from "~/components/pages/Page404";
import ServerError from "~/components/ui/errors/ServerError";
import RedirectsService from "~/modules/redirects/RedirectsService";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  RedirectsService.findAndRedirect({ request });
  return Response.json({}, { status: 404 });
};

export default function () {
  return <Page404 />;
}

export function ErrorBoundary() {
  return <ServerError />;
}
