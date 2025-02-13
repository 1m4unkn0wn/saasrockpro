// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunction, LoaderFunctionArgs } from "react-router";
import { getTranslations } from "~/locale/i18next.server";

type LoaderData = {};
export const loader = async ({ params }: LoaderFunctionArgs) => {
  const data: LoaderData = {};
  return data;
};

type ActionData = {
  error?: string;
};
const badRequest = (data: ActionData) => Response.json(data, { status: 400 });
export const action: ActionFunction = async ({ request, params }) => {
  const { t } = await getTranslations(request);
  return badRequest({ error: t("shared.invalidForm") });
};

export default function EditEntityIndexRoute() {
  return <div>Routes</div>;
}
