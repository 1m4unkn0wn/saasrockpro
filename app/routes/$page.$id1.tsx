// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunction, LoaderFunctionArgs, MetaFunction, useLoaderData } from "react-router";
import { getCurrentPage } from "~/modules/pageBlocks/services/.server/pagesService";
import PageBlocks from "~/modules/pageBlocks/components/blocks/PageBlocks";
import { PageBlockService } from "~/modules/pageBlocks/services/.server/blocksService";
import { PageLoaderData } from "~/modules/pageBlocks/dtos/PageBlockData";
import ServerError from "~/components/ui/errors/ServerError";
import ErrorBanner from "~/components/ui/banners/ErrorBanner";
import { useTranslation } from "react-i18next";
import { createMetrics } from "~/modules/metrics/services/.server/MetricTracker";
import Page404 from "~/components/pages/Page404";
import { useState, useEffect } from "react";

export const meta: MetaFunction<typeof loader> = ({ data }) => data?.metatags || [];

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const page = await getCurrentPage({ request, params, slug: "/" + params.page + "/:id1" });
  if (!page.page && page.blocks.length === 0 && !params.page?.includes(".")) {
    throw Response.json({ metatags: [{ title: "404" }] }, { status: 404 });
  }
  return page;
};

export const action: ActionFunction = async ({ request, params }) => PageBlockService.action({ request, params });

export default function () {
  const { t } = useTranslation();
  const data = useLoaderData<PageLoaderData>();
  const [blocks, setBlocks] = useState(data.blocks);
  useEffect(() => {
    setBlocks(data.blocks);
  }, [data]);
  return (
    <>
      {!data || !data.blocks || !data.blocks.length ? (
        <Page404 />
      ) : data.error ? (
        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
          <ErrorBanner title={t("shared.error")} text={data.error} />
        </div>
      ) : (
        <PageBlocks items={blocks} onChange={setBlocks} />
      )}
    </>
  );
}

export function ErrorBoundary() {
  return <ServerError />;
}
