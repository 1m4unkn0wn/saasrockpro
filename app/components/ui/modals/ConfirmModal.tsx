// @@@ pwned by 1m4unkn0wn @@@
import { forwardRef, Fragment, Ref, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, TransitionChild } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import ButtonPrimary from "../buttons/ButtonPrimary";

export interface RefConfirmModal {
  setDestructive: (destructive: boolean) => void;
  setValue: (value: any) => void;
  show: (_question: string, _yesTitle?: string, _noTitle?: string, _description?: string, _inputString?: string) => void;
}

interface Props {
  destructive?: boolean;
  inputType?: string;
  onYes?: (value: any) => void;
  onNo?: () => void;
  placeholder?: string;
}

const ConfirmModal = (props: Props, ref: Ref<RefConfirmModal>) => {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState<string>();
  const [value, setValue] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [inputString, setInputString] = useState<string | undefined>("");
  const [yesTitle, setYesTitle] = useState<string>("");
  const [noTitle, setNoTitle] = useState<string>("");
  const [isDestructive, setDestructive] = useState<boolean>(props.destructive || false);

  const inputValue = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitle(t("shared.confirm").toString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function no() {
    setOpen(false);
    if (props.onNo) {
      props.onNo();
    }
  }

  function yes() {
    setOpen(false);
    if (props.onYes) {
      props.onYes(value ?? inputString);
    }
  }

  useImperativeHandle(ref, () => ({ show, setValue, setDestructive }));

  function show(
    _question: string,
    _yesTitle: string = t("shared.confirm").toString(),
    _noTitle: string = t("shared.back").toString(),
    _description?: string,
    _inputString?: string
  ) {
    setTitle(_question.toString());
    if (_yesTitle) {
      setYesTitle(_yesTitle);
    }
    if (_noTitle) {
      setNoTitle(_noTitle);
    }
    if (_description) {
      setDescription(_description);
    }
    setTimeout(() => {
      if ((props.inputType === "email" || props.inputType === "string" || props.inputType === "slug") && inputValue.current) {
        inputValue.current.focus();
        inputValue.current.select();
      }
    }, 0);
    setOpen(true);
    setInputString(_inputString);
  }
  return (
    <Dialog open={open} onClose={setOpen} className="fixed inset-0 z-50 overflow-y-auto">
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
          <DialogPanel className="bg-background inline-block w-full transform overflow-hidden rounded-lg px-4 pb-4 pt-5 text-left align-bottom shadow-xl transition-all sm:my-8 sm:max-w-lg sm:p-6 sm:align-middle">
            <div>
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-yellow-300 bg-yellow-50">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-yellow-600"
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
                <DialogTitle as="h3" className="text-foreground text-lg font-medium leading-6">
                  {title}
                </DialogTitle>
                <div className="mt-2">
                  <p className="text-muted-foreground text-sm">{description}</p>
                </div>
                {props.inputType === "email" && (
                  <div className="mt-4">
                    <label htmlFor="value" className="block text-sm font-medium text-gray-700"></label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        {/*Heroicon name: solid/mail */}
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                          <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                        </svg>
                      </div>
                      <input
                        value={inputString}
                        onChange={(e) => setInputString(e.target.value)}
                        ref={inputValue}
                        type="value"
                        name="email"
                        id="email"
                        className="block w-full rounded-md border-gray-300 pl-10 focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                )}
                {props.inputType === "string" && (
                  <div className="mt-4">
                    <label htmlFor="value" className="block text-sm font-medium text-gray-700"></label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                      <input
                        value={inputString}
                        onChange={(e) => setInputString(e.target.value)}
                        ref={inputValue}
                        type="text"
                        name="value"
                        id="value"
                        className="block w-full rounded-md border-gray-300 focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                        placeholder={props.placeholder}
                      />
                    </div>
                  </div>
                )}
                {props.inputType === "slug" && (
                  <div className="mt-4">
                    <label htmlFor="value" className="block text-sm font-medium text-gray-700"></label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                      <input
                        value={inputString}
                        onChange={(e) => setInputString(e.target.value.toLowerCase())}
                        ref={inputValue}
                        type="text"
                        name="value"
                        id="value"
                        className="block w-full rounded-md border-gray-300 focus:border-gray-500 focus:ring-gray-500 sm:text-sm"
                        placeholder={props.placeholder}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <button
                type="button"
                onClick={no}
                data-autofocus
                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
              >
                {noTitle}
              </button>
              <ButtonPrimary
                type="button"
                onClick={yes}
                destructive={isDestructive}
                className="inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base  font-medium shadow-sm  focus:outline-none focus:ring-2 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
              >
                {yesTitle}
              </ButtonPrimary>
            </div>
          </DialogPanel>
        </TransitionChild>
      </div>
    </Dialog>
  );
};

export default forwardRef(ConfirmModal);
