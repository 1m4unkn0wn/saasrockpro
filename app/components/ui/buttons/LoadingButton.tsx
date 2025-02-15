// @@@ pwned by 1m4unkn0wn @@@
import ButtonPrimary from "./ButtonPrimary";
import { forwardRef, MouseEventHandler, ReactNode, Ref, useImperativeHandle, useState } from "react";
import clsx from "clsx";
import { useNavigation } from "react-router";

export interface RefLoadingButton {
  start: () => void;
  stop: () => void;
}

interface Props {
  className?: string;
  type?: "button" | "submit" | "reset" | undefined;
  disabled?: boolean;
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  to?: string;
  actionName?: string;
  isLoading?: boolean;
}

const LoadingButton = ({ className, type = "button", children, disabled, onClick, to, actionName, isLoading }: Props, ref: Ref<RefLoadingButton>) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  useImperativeHandle(ref, () => ({
    start,
    stop,
  }));

  function start() {
    setLoading(true);
  }
  function stop() {
    setLoading(false);
  }
  const submitting = navigation.state === "submitting";

  function checkIsLoading() {
    if (isLoading !== undefined) {
      return isLoading;
    }
    const loadingOrSubmitting = loading || submitting;
    if (actionName) {
      return loadingOrSubmitting && navigation.state === "submitting" && navigation.formData?.get("action") === actionName;
    }
    return loadingOrSubmitting;
  }

  return (
    <ButtonPrimary
      disabled={disabled || checkIsLoading()}
      className={clsx(className, "relative justify-center", checkIsLoading() && "base-spinner cursor-not-allowed")}
      type={type}
      onClick={onClick}
      to={to}
    >
      {/* {checkIsLoading() && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />} */}

      {children}
    </ButtonPrimary>
  );
};

export default forwardRef(LoadingButton);
