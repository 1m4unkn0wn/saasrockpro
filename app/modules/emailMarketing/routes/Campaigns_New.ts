// @@@ pwned by 1m4unkn0wn @@@
import { LoaderFunctionArgs, ActionFunction, redirect } from "react-router";
import { getTranslations } from "~/locale/i18next.server";
import { EntityViewsApi } from "~/utils/api/.server/EntityViewsApi";
import { getTenantIdOrNull } from "~/utils/services/.server/urlService";
import { EmailSenderWithoutApiKey, getAllEmailSenders, getEmailSender } from "../db/emailSender";
import EmailMarketingService from "../services/EmailMarketingService";
import { requireAuth } from "~/utils/loaders.middleware";

export namespace Campaigns_New {
  export type LoaderData = {
    title: string;
    contactsViews: EntityViewsApi.GetEntityViewsWithRows[];
    emailSenders: EmailSenderWithoutApiKey[];
  };
  export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    await requireAuth({ request, params });
    const tenantId = await getTenantIdOrNull({ request, params });
    const emailSenders = await getAllEmailSenders(tenantId);
    const data: LoaderData = {
      title: `New campaign | ${process.env.APP_NAME}`,
      emailSenders,
      contactsViews: await EntityViewsApi.getAll({
        entityName: "contact",
        tenantId,
        withDefault: false,
        withRows: false,
      }),
    };
    return data;
  };

  export type ActionData = {
    error?: string;
    success?: string;
  };
  export const action: ActionFunction = async ({ request, params }) => {
    await requireAuth({ request, params });
    const { t } = await getTranslations(request);
    const tenantId = await getTenantIdOrNull({ request, params });
    const form = await request.formData();
    const action = form.get("action")?.toString() ?? "";
    const email = form.get("email")?.toString() ?? "";
    const senderId = form.get("senderId")?.toString() ?? "";
    let subject = form.get("subject")?.toString() ?? "";
    let htmlBody = form.get("htmlBody")?.toString() ?? "";
    let textBody = form.get("textBody")?.toString() ?? "";
    // console.log({ action, email, subject });
    const sender = await getEmailSender(senderId, tenantId);
    if (!sender) {
      return Response.json({ error: "Invalid sender" }, { status: 400 });
    }
    if (!htmlBody && !textBody) {
      return Response.json({ error: "Email body is required" }, { status: 400 });
    }
    if (action === "send-preview") {
      try {
        await EmailMarketingService.sendPreview({
          from: { sender, tenantId },
          email: { to: email, subject, htmlBody, textBody, track: true },
        });
        return Response.json({ success: t("shared.sent") }, { status: 200 });
      } catch (e: any) {
        return Response.json({ error: e.message }, { status: 400 });
      }
    } else if (action === "send-contact-preview") {
      try {
        const contactRowId = form.get("contactRowId")?.toString() ?? "";
        await EmailMarketingService.sendContactPreview({
          contactRowId,
          from: { sender, tenantId },
          email: { to: email, subject, htmlBody, textBody, track: true },
        });
        return Response.json({ success: t("shared.sent") }, { status: 200 });
      } catch (e: any) {
        return Response.json({ error: e.message }, { status: 400 });
      }
    } else if (action === "create") {
      const name = form.get("name")?.toString() ?? "";
      if (!name) {
        return Response.json({ error: "Invalid name" }, { status: 400 });
      }
      const contactViewId = form.get("contactViewId")?.toString();
      if (!contactViewId) {
        return Response.json({ error: "Invalid contact/recipient list" }, { status: 400 });
      }
      try {
        const campaign = await EmailMarketingService.createCampaignDraft({
          name: form.get("name")?.toString() ?? "",
          contactViewId,
          from: { sender, tenantId },
          email: { subject, htmlBody, textBody, track: true },
        });
        return redirect(params.tenant ? `/app/${params.tenant}/email-marketing/campaigns/${campaign.id}` : `/admin/email-marketing/campaigns/${campaign.id}`);
      } catch (e: any) {
        return Response.json({ error: e.message }, { status: 400 });
      }
    } else {
      return Response.json({ error: t("shared.invalidForm") }, { status: 400 });
    }
  };
}
