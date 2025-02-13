// @@@ pwned by 1m4unkn0wn @@@
import { Fragment } from "react";
import { useRootData } from "~/utils/data/useRootData";

export default function ScriptRewardful() {
  const rootData = useRootData();
  const affiliates = rootData.appConfiguration?.affiliates;
  if (!affiliates) {
    return null;
  }
  if (!affiliates.provider || !affiliates.provider.rewardfulApiKey) {
    return null;
  }
  return (
    <Fragment>
      <script
        async
        id="rewardful-init"
        dangerouslySetInnerHTML={{
          __html: `(function(w,r){w._rwq=r;w[r]=w[r]||function(){(w[r].q=w[r].q||[]).push(arguments)}})(window,'rewardful');`,
        }}
      />
      <script async src="https://r.wdfl.co/rw.js" data-rewardful={affiliates.provider.rewardfulApiKey}></script>
    </Fragment>
  );
}
