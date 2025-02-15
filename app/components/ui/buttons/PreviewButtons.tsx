// @@@ pwned by 1m4unkn0wn @@@
import ButtonPrimary from "./ButtonPrimary";
import ButtonSecondary from "./ButtonSecondary";
import ButtonTertiary from "./ButtonTertiary";
import LoadingButton, { RefLoadingButton } from "./LoadingButton";
import { useRef } from "react";

export default function PreviewButtons() {
  const loadingButton = useRef<RefLoadingButton>(null);
  function startLoading() {
    if (loadingButton.current) {
      loadingButton.current?.start();
      setTimeout(() => {
        loadingButton.current?.stop();
      }, 2000);
    }
  }
  return (
    <div id="buttons">
      <div className="border-muted-foreground overflow-hidden rounded-lg border-2 border-dashed p-6">
        <div id="buttons" className="w-full space-y-2">
          <div className="mx-auto flex max-w-3xl flex-col items-center justify-center space-y-4 sm:flex-row sm:items-end sm:justify-center sm:space-x-4 sm:space-y-0">
            <ButtonPrimary onClick={() => alert("Clicked primary button")}>Primary</ButtonPrimary>
            <ButtonSecondary onClick={() => alert("Clicked secondary button")}>Secondary</ButtonSecondary>
            <ButtonTertiary onClick={() => alert("Clicked tertiary button")}>Tertiary</ButtonTertiary>
            <LoadingButton ref={loadingButton} onClick={() => startLoading()}>
              Loading
            </LoadingButton>
          </div>
          <div className="mx-auto flex max-w-3xl flex-col items-center justify-center space-y-4 sm:flex-row sm:items-end sm:justify-center sm:space-x-4 sm:space-y-0">
            <ButtonPrimary disabled={true}>Primary</ButtonPrimary>
            <ButtonSecondary disabled={true}>Secondary</ButtonSecondary>
            <ButtonTertiary disabled={true}>Tertiary</ButtonTertiary>
            <LoadingButton disabled={true}>Loading</LoadingButton>
          </div>
        </div>
      </div>
    </div>
  );
}
