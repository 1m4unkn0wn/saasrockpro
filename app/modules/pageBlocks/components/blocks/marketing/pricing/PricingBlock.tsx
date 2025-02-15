// @@@ pwned by 1m4unkn0wn @@@
import { useActionData } from "react-router";
import { PricingBlockDto } from "./PricingBlockUtils";
import PricingVariantSimple from "./PricingVariantSimple";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function PricingBlock({ item }: { item: PricingBlockDto }) {
  const actionData = useActionData<{ error?: string }>();
  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData.error);
    }
  }, [actionData?.error]);
  return <>{item.style === "simple" && <PricingVariantSimple item={item} />}</>;
}
