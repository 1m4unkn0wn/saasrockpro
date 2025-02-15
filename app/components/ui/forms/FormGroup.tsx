// @@@ pwned by 1m4unkn0wn @@@
import { Form, useActionData, useSubmit, useNavigation } from "react-router";
import clsx from "clsx";
import { FormEvent, forwardRef, ReactNode, Ref, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ButtonSecondary from "../buttons/ButtonSecondary";
import LoadingButton from "../buttons/LoadingButton";
import ConfirmModal, { RefConfirmModal } from "../modals/ConfirmModal";
import ErrorModal, { RefErrorModal } from "../modals/ErrorModal";
import InfoBanner from "../banners/InfoBanner";
import ErrorBanner from "../banners/ErrorBanner";

export interface RefFormGroup {
  submitForm: () => void;
}

interface Props {
  id?: string | undefined;
  onCancel?: () => void;
  children: ReactNode;
  className?: string;
  classNameFooter?: string;
  editing?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  canSubmit?: boolean;
  onSubmit?: (e: FormData) => void | undefined;
  onDelete?: () => void;
  onCreatedRedirect?: string;
  confirmationPrompt?: {
    title: string;
    yesTitle?: string;
    noTitle?: string;
    description?: string;
  };
  deleteRedirect?: string;
  actionNames?: {
    create?: string;
    update?: string;
    delete?: string;
  };
  state?: { loading?: boolean; submitting?: boolean };
  message?: {
    success?: string;
    error?: string;
  };
  labels?: {
    create?: string;
  };
  withErrorModal?: boolean;
  submitDisabled?: boolean;
}
const FormGroup = (
  {
    id,
    onCancel,
    children,
    className,
    classNameFooter,
    editing,
    canUpdate = true,
    canDelete = true,
    canSubmit = true,
    confirmationPrompt,
    onSubmit,
    onCreatedRedirect,
    deleteRedirect,
    onDelete,
    actionNames,
    state,
    message,
    labels,
    withErrorModal = true,
    submitDisabled,
  }: Props,
  ref: Ref<RefFormGroup>
) => {
  const { t } = useTranslation();

  const formRef = useRef<HTMLFormElement>(null);
  useImperativeHandle(ref, () => ({
    submitForm,
  }));
  function submitForm() {
    const formData = new FormData(formRef.current!);
    submit(formData, {
      method: "post",
    });
  }

  const actionData = useActionData<{
    error?: string;
  }>();
  const navigation = useNavigation();
  const loading = navigation.state === "submitting" || state?.submitting;
  const submit = useSubmit();

  const confirmRemove = useRef<RefConfirmModal>(null);
  const confirmSubmit = useRef<RefConfirmModal>(null);
  const errorModal = useRef<RefErrorModal>(null);

  const [error, setError] = useState<string>();
  const [formData, setFormData] = useState<FormData>();

  useEffect(() => {
    setError(actionData?.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionData]);

  useEffect(() => {
    setError(undefined);
    if (error) {
      errorModal.current?.show(t("shared.error"), error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  function remove() {
    confirmRemove.current?.show(t("shared.confirmDelete"), t("shared.delete"), t("shared.cancel"), t("shared.warningCannotUndo"));
  }

  function yesRemove() {
    if (onDelete) {
      onDelete();
    } else {
      const form = new FormData();
      form.set("action", actionNames?.delete ?? "delete");
      form.set("id", id ?? "");
      form.set("redirect", deleteRedirect ?? "");
      submit(form, {
        method: "post",
      });
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.stopPropagation();
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (confirmationPrompt) {
      setFormData(formData);
      confirmSubmit.current?.show(confirmationPrompt.title, confirmationPrompt.yesTitle, confirmationPrompt.noTitle, confirmationPrompt.description);
    } else {
      if (onSubmit !== undefined) {
        onSubmit(formData);
      } else {
        submit(formData, {
          method: "post",
        });
      }
    }
  }

  function yesSubmit() {
    if (formData) {
      if (onSubmit !== undefined) {
        onSubmit(formData);
      } else {
        submit(formData, {
          method: "post",
        });
      }
    }
  }

  return (
    <Form ref={formRef} method="post" acceptCharset="utf-8" className={clsx(className, "py-1")} onSubmit={handleSubmit}>
      <input type="hidden" name="action" value={id ? actionNames?.update ?? "edit" : actionNames?.create ?? "create"} hidden readOnly />
      <input type="hidden" name="id" value={id ?? ""} hidden readOnly />
      <div className="space-y-3">
        {children}

        {(!id || editing) && canSubmit && (
          <div className={clsx(classNameFooter, "flex justify-between space-x-2")}>
            <div className="flex items-center space-x-2">
              {id && canDelete && (
                <ButtonSecondary disabled={loading || !canDelete} destructive={true} type="button" onClick={remove}>
                  <div>{t("shared.delete")}</div>
                </ButtonSecondary>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {onCancel && (
                <ButtonSecondary onClick={onCancel} disabled={loading}>
                  <div>{t("shared.cancel")}</div>
                </ButtonSecondary>
              )}
              {id === undefined && onCreatedRedirect === "addAnother" ? (
                <div>
                  <LoadingButton isLoading={state?.submitting} type="submit" disabled={loading || submitDisabled}>
                    <div>{t("shared.saveAndAdd")}</div>
                  </LoadingButton>
                </div>
              ) : (
                <LoadingButton isLoading={state?.submitting} type="submit" disabled={loading || (id !== undefined && !canUpdate) || submitDisabled}>
                  {labels?.create ?? t("shared.save")}
                </LoadingButton>
              )}
            </div>

            {message && (
              <div>
                {<InfoBanner title={t("shared.success")} text={message.success} />}
                {<ErrorBanner title={t("shared.error")} text={message.error} />}
              </div>
            )}
          </div>
        )}
      </div>
      <ConfirmModal ref={confirmSubmit} onYes={yesSubmit} />
      <ConfirmModal ref={confirmRemove} onYes={yesRemove} destructive />
      {withErrorModal && canSubmit && <ErrorModal ref={errorModal} />}
    </Form>
  );
};

export default forwardRef(FormGroup);
