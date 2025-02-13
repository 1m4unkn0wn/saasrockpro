// @@@ pwned by 1m4unkn0wn @@@
import FooterBlock from "~/modules/pageBlocks/components/blocks/marketing/footer/FooterBlock";
import HeaderBlock from "~/modules/pageBlocks/components/blocks/marketing/header/HeaderBlock";
import { useEffect } from "react";
import { ActionFunction, ActionFunctionArgs, LoaderFunctionArgs, useLoaderData } from "react-router";
import { useActionData } from "react-router";
import { useTranslation } from "react-i18next";
import { getTranslations } from "~/locale/i18next.server";
import ServerError from "~/components/ui/errors/ServerError";
import { PageLoaderData } from "~/modules/pageBlocks/dtos/PageBlockData";
import { PricingBlockDto } from "~/modules/pageBlocks/components/blocks/marketing/pricing/PricingBlockUtils";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import toast from "react-hot-toast";
import HeadingBlock from "~/modules/pageBlocks/components/blocks/marketing/heading/HeadingBlock";
import PricingVariantSimple from "~/modules/pageBlocks/components/blocks/marketing/pricing/PricingVariantSimple";
import { v2MetaFunction } from "~/utils/compat/v2MetaFunction";
import { PricingBlockService } from "~/modules/pageBlocks/components/blocks/marketing/pricing/PricingBlockService.server";

export const meta: v2MetaFunction<PageLoaderData> = ({ data }) => data?.metatags || [];

type LoaderData = {
  metatags: MetaTagsDto;
  pricingData: PricingBlockDto["data"];
};
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { t } = await getTranslations(request);
  const pricingData = await PricingBlockService.load({ request, params, t });
  const data: LoaderData = {
    metatags: [{ title: `${t("front.pricing.title")} | ${process.env.APP_NAME}` }, { name: "description", content: t("front.pricing.headline") }],
    pricingData,
  };
  return Response.json(data);
};

type ActionData = { success?: string; error?: string };
export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { t } = await getTranslations(request);
  const form = await request.formData();
  const action = form.get("action");
  if (action === "subscribe") {
    return await PricingBlockService.subscribe({ request, params, t, form });
  }
};

export default function () {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();

  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData.error);
    }
  }, [actionData?.error]);

  return (
    <div>
      <HeaderBlock />
      <div className="py-4">
        <HeadingBlock
          item={{
            style: "centered",
            headline: t("front.pricing.title"),
            subheadline: t("front.pricing.headline"),
          }}
        />
      </div>

      <PricingVariantSimple
        item={{
          style: "simple",
          allowCoupons: true,
          contactUs: {
            title: "pricing.contactUs",
            description: "pricing.customPlanDescription",
            features: ["+12 users", "Unlimited API calls", "Priority support"],
          },
          data: data.pricingData,
        }}
      />

      <FooterBlock />
    </div>
  );
}

export function ErrorBoundary() {
  return <ServerError />;
}
