// @@@ pwned by 1m4unkn0wn @@@
import { useTranslation } from "react-i18next";
import ErrorModal, { RefErrorModal } from "~/components/ui/modals/ErrorModal";
import { useEffect, useRef, useState } from "react";
import LoadingButton from "~/components/ui/buttons/LoadingButton";
import { Form, useActionData, useSubmit } from "react-router";
import SuccessModal, { RefSuccessModal } from "~/components/ui/modals/SuccessModal";
import RowProperties from "~/components/entities/rows/RowProperties";
import { EntityWithDetails } from "~/utils/db/entities/entities.db.server";
import InputText, { RefInputText } from "~/components/ui/input/InputText";

export default function TenantNew({ tenantSettingsEntity }: { tenantSettingsEntity: EntityWithDetails | null }) {
  const actionData = useActionData<{ tenantId?: string; error?: string; success?: string }>();
  const { t } = useTranslation();
  const submit = useSubmit();

  const inputName = useRef<RefInputText>(null);
  const errorModal = useRef<RefErrorModal>(null);
  const successModal = useRef<RefSuccessModal>(null);

  const [name, setName] = useState("");

  useEffect(() => {
    inputName.current?.input.current?.focus();
    inputName.current?.input.current?.select();
  }, []);

  useEffect(() => {
    if (actionData?.error) {
      errorModal.current?.show(actionData.error);
    } else if (actionData?.success) {
      successModal.current?.show(actionData.success);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData]);

  function createdTenant() {
    if (actionData?.tenantId) {
      const form = new FormData();
      form.set("action", "set-tenant");
      form.set("tenantId", actionData.tenantId);
      form.set("redirectTo", location.pathname + location.search);
      submit(form, {
        method: "post",
        action: "/app",
      });
    }
  }

  return (
    <div>
      <div className="flex flex-1 flex-col justify-between">
        <Form method="post" className="">
          <input type="hidden" name="action" value="create" hidden readOnly />
          <div className="space-y-3 pb-5 pt-2">
            <div>
              {/* <label className="block text-xs font-medium text-gray-600">
                {t("account.register.organization")} <span className="ml-1 text-red-500">*</span>
              </label> */}

              <div className="mt-1 -space-y-px rounded-md shadow-sm">
                <div>
                  {/* <label htmlFor="tax-id" className="sr-only">
                    {t("shared.name")}
                  </label> */}
                  <InputText
                    title={t("shared.name")}
                    ref={inputName}
                    type="text"
                    name="name"
                    id="name"
                    placeholder={t("shared.name")}
                    required
                    value={name}
                    setValue={setName}
                    // className="focus:border-theme-500 focus:ring-theme-500 relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-800 placeholder-gray-500 focus:z-10 focus:outline-none sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {tenantSettingsEntity && (
              <div className="col-span-6 sm:col-span-6">
                <RowProperties entity={tenantSettingsEntity} item={null} />
              </div>
            )}
          </div>

          <div className="pb-6 text-right">
            <div className="right-0 text-sm leading-5">
              <span className="ml-2 inline-flex rounded-sm shadow-sm">
                <LoadingButton type="submit">{t("shared.create")}</LoadingButton>
              </span>
            </div>
          </div>
        </Form>
      </div>
      <SuccessModal ref={successModal} onClosed={createdTenant} />
      <ErrorModal ref={errorModal} />
    </div>
  );
}
