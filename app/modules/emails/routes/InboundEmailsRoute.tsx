// @@@ pwned by 1m4unkn0wn @@@
import { useSubmit, Outlet, useActionData, useLoaderData } from "react-router";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import EmailsTable from "~/components/core/emails/EmailsTable";
import InputFilters from "~/components/ui/input/InputFilters";
import IndexPageLayout from "~/components/ui/layouts/IndexPageLayout";
import ConfirmModal, { RefConfirmModal } from "~/components/ui/modals/ConfirmModal";
import { ActionDataEmails } from "../actions/inbound-emails";
import { LoaderDataEmails } from "../loaders/inbound-emails";

export default function InboundEmailsRoute() {
  const data = useLoaderData<LoaderDataEmails>();
  const actionData = useActionData<ActionDataEmails>();
  const submit = useSubmit();
  const { t } = useTranslation();

  const confirmModal = useRef<RefConfirmModal>(null);

  function confirmedSync() {
    const form = new FormData();
    form.set("action", "sync");
    submit(form, { method: "post" });
  }

  return (
    <IndexPageLayout
      title={
        <div className="flex flex-col">
          <div>{t("models.email.inboundEmails")}</div>
          <div className="truncate text-xs font-normal">
            <span className="select-all italic">{data.error ? <div className="text-red-500">{data.error}</div> : data.inboundEmailAddress}</span>
          </div>
        </div>
      }
      buttons={
        <div className="flex items-center space-x-2">
          <InputFilters filters={data.filterableProperties} />
        </div>
      }
    >
      <div className="space-y-2">
        <EmailsTable items={actionData?.items ?? data.items} withTenant={data.tenantId === null} pagination={data.pagination} />

        <ConfirmModal ref={confirmModal} onYes={confirmedSync} />

        <Outlet />
      </div>
    </IndexPageLayout>
  );
}
