// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction, useActionData, useLoaderData } from "react-router";
import { useEffect, useState } from "react";
import PageBlocks from "~/modules/pageBlocks/components/blocks/PageBlocks";
import { useSearchParams } from "react-router";
import { getCurrentPage } from "~/modules/pageBlocks/services/.server/pagesService";
import { PageLoaderData } from "~/modules/pageBlocks/dtos/PageBlockData";
import ErrorBanner from "~/components/ui/banners/ErrorBanner";
import { useTranslation } from "react-i18next";
import { serverTimingHeaders } from "~/modules/metrics/utils/defaultHeaders.server";
import Modal from "~/components/ui/modals/Modal";
import LoginForm from "~/modules/users/components/LoginForm";
import toast from "react-hot-toast";
import AuthService from "~/modules/users/services/AuthService";
import { useRootData } from "~/utils/data/useRootData";
import { PricingBlockService } from "~/modules/pageBlocks/components/blocks/marketing/pricing/PricingBlockService.server";
import { getTranslations } from "~/locale/i18next.server";
import { v2MetaFunction } from "~/utils/compat/v2MetaFunction";
export { serverTimingHeaders as headers };

export const meta: v2MetaFunction<PageLoaderData> = ({ data }) => data?.metatags ?? [];

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const page = await getCurrentPage({ request, params, slug: "/" });
  return Response.json(page);
};

type ActionData = { error?: string; success?: string; authRequired?: boolean };
export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { t } = await getTranslations(request);
  const form = await request.formData();
  const action = form.get("action");
  if (action === "login") {
    return await AuthService.loginFromRequest(request, form);
  } else if (action === "subscribe") {
    return await PricingBlockService.subscribe({ request, params, form, t });
  }
};

export default function () {
  const { t } = useTranslation();
  const rootData = useRootData();
  const data = useLoaderData<PageLoaderData>();
  const actionData = useActionData<ActionData>();
  const [searchParams] = useSearchParams();
  const [blocks, setBlocks] = useState(data.blocks);
  const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      // @ts-ignore
      $crisp.push(["do", "chat:show"]);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (actionData?.success) {
      toast.success(actionData.success, {
        position: "bottom-right",
      });
    } else if (actionData?.error) {
      toast.error(actionData.error);
    }
    if (actionData?.authRequired) {
      setLoginModalOpen(true);
    }
  }, [actionData]);

  useEffect(() => {
    if (rootData.user) {
      setLoginModalOpen(false);
    }
  }, [rootData.user]);

  return (
    <div>
      {data.error ? (
        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
          <ErrorBanner title={t("shared.error")} text={data.error} />
        </div>
      ) : (
        <div>
          <PageBlocks
            items={blocks}
            onChange={setBlocks}
            editor={searchParams.get("editMode") === "true" ? { add: true, edit: true, remove: true, move: true, download: true, ai: true } : undefined}
          />
        </div>
      )}

      <Modal padding="sm" className="sm:max-w-sm" open={loginModalOpen} setOpen={setLoginModalOpen}>
        <LoginForm key={loginModalOpen ? "open" : "closed"} actionData={actionData} redirectTo="/" />
      </Modal>
    </div>
  );
}
