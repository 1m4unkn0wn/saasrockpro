// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunctionArgs, useFetcher } from "react-router";
import ServerError from "~/components/ui/errors/ServerError";
import ButtonSecondary from "~/components/ui/buttons/ButtonSecondary";
import { Fragment, useEffect } from "react";
import SeedService from "~/utils/db/seed/SeedService";
import toast from "react-hot-toast";
import CheckIcon from "~/components/ui/icons/CheckIcon";
import ExclamationTriangleIconFilled from "~/components/ui/icons/ExclamationTriangleIconFilled";

export const loader = async () => {
  if (process.env.NODE_ENV !== "development") {
    throw Response.json({ error: "development-only" }, { status: 404 });
  }
  return Response.json({});
};

type ActionData = { action: string; success?: string; error?: string };
export const action = async ({ request, params }: ActionFunctionArgs) => {
  const form = await request.formData();
  const action = form.get("action");
  if (action === "seed") {
    try {
      await SeedService.seed();
      return Response.json({ action, success: "Database seeded" });
    } catch (e: any) {
      return Response.json({ action, error: e.message }, { status: 400 });
    }
  }
};

export default function () {
  const fetcher = useFetcher<ActionData | null>();

  useEffect(() => {
    if (fetcher.data?.success) {
      toast.success(fetcher.data.success);
    } else if (fetcher.data?.error) {
      toast.error(fetcher.data.error);
    }
  }, [fetcher.data]);

  function onSeed() {
    const form = new FormData();
    form.set("action", "seed");
    fetcher.submit(form, {
      method: "post",
    });
  }

  return (
    <div>
      <div className="prose container mx-auto p-12">
        <div>
          <h3 className="text-2xl font-medium">Dev</h3>
          <p className="text-muted-foreground">This route is only available in development mode. It has some utility functions for development purposes.</p>
        </div>

        <div>
          <ButtonSecondary onClick={onSeed} isLoading={fetcher.state === "submitting"}>
            <ActionMessage title="Seed Database" data={fetcher.data} />
          </ButtonSecondary>
        </div>
      </div>
    </div>
  );
}

function ActionMessage({ title, data }: { title: string; data: ActionData | null | undefined }) {
  if (data?.success) {
    return (
      <Fragment>
        <CheckIcon className="h-4 w-4 text-green-500" />
        <span className="ml-2">{data.success}</span>
      </Fragment>
    );
  }

  if (data?.error) {
    return (
      <Fragment>
        <ExclamationTriangleIconFilled className="h-4 w-4 text-red-500" />
        <span className="ml-2">{data.error}</span>
      </Fragment>
    );
  }

  return <div>{title}</div>;
}

export function ErrorBoundary() {
  return <ServerError />;
}
