// @@@ pwned by 1m4unkn0wn @@@
import { redirect } from "react-router";
import { deleteEmail } from "~/utils/db/email/emails.db.server";
import { Params } from "react-router";
import { getTranslations } from "~/locale/i18next.server";
import { requireAuth } from "~/utils/loaders.middleware";

export type ActionDataEmails = {
  error?: string;
};
const badRequest = (data: ActionDataEmails) => Response.json(data, { status: 400 });
export const actionInboundEmailEdit = async (request: Request, params: Params, redirectUrl: string) => {
  await requireAuth({ request, params });
  const { t } = await getTranslations(request);
  const form = await request.formData();

  const action = form.get("action");
  if (action === "delete") {
    await deleteEmail(params.id ?? "");
    return redirect(redirectUrl);
  } else {
    return badRequest({ error: t("shared.invalidForm") });
  }
};
