// @@@ pwned by 1m4unkn0wn @@@
import { LoaderFunctionArgs } from "react-router";
import Page404 from "~/components/pages/Page404";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return Response.json({});
};
export default function Route404() {
  return (
    <>
      <Page404 />
    </>
  );
}
