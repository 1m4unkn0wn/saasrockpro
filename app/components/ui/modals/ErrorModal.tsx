// @@@ pwned by 1m4unkn0wn @@@
import { forwardRef, Fragment, Ref, useEffect, useImperativeHandle, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, Transition, TransitionChild } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import clsx from "~/utils/shared/ClassesUtils";

export interface RefErrorModal {
  show: (title?: string, description?: string) => void;
}

interface Props {
  className?: string;
  onClosed?: () => void;
}

const ErrorModal = ({ className, onClosed }: Props, ref: Ref<RefErrorModal>) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [closeText, setCloseText] = useState<string>();

  useEffect(() => {
    setTitle(t("shared.error").toString());
    setCloseText(t("shared.close"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function show(_title?: string, _description?: string) {
    if (_title) {
      setTitle(_title);
    }
    if (_description) {
      setDescription(_description);
    } else if (_title) {
      setTitle(t("shared.error").toString());
      setDescription(_title);
    }
    setOpen(true);
  }

  useImperativeHandle(ref, () => ({ show }));

  function close() {
    setOpen(false);
    if (onClosed) {
      onClosed();
    }
  }

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className={clsx(className, "fixed inset-0 z-50 overflow-y-auto")} onClose={setOpen}>
        <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </TransitionChild>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
            &#8203;
          </span>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel className="bg-background inline-block w-full transform overflow-hidden rounded-lg px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all sm:my-8 sm:max-w-sm sm:p-6 sm:align-middle">
              <div>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-foreground text-lg font-medium leading-6">{title}</h3>
                  <div className="mt-2">
                    <p className="text-muted-foreground text-sm">{description}</p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  className="mt-0 inline-flex w-full justify-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  onClick={close}
                >
                  {closeText}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
};

export default forwardRef(ErrorModal);
