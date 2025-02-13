// @@@ pwned by 1m4unkn0wn @@@
import { LoaderFunctionArgs, redirect } from "react-router";
import ServerError from "~/components/ui/errors/ServerError";
import ShowPayloadModalButton from "~/components/ui/json/ShowPayloadModalButton";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import { useAppData } from "~/utils/data/useAppData";
import { useRootData } from "~/utils/data/useRootData";
import { getUser } from "~/utils/db/users.db.server";
import { requireAuth } from "~/utils/loaders.middleware";
import { getUserInfo } from "~/utils/session.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await requireAuth({ request, params });
  const userInfo = await getUserInfo(request);
  const user = await getUser(userInfo.userId);
  if (process.env.NODE_ENV === "production" && !user?.admin) {
    throw redirect("/404?error=development-only");
  }
  return Response.json({});
};

export default function Debug() {
  const rootData = useRootData();
  const appData = useAppData();
  return (
    <EditPageLayout title="Debug">
      <div className="space-y-2">
        <ShowPayloadModalButton title="Root Data" description="Root Data" payload={JSON.stringify(rootData, null, 2)} />
        <ShowPayloadModalButton title="App Data" description="App Data" payload={JSON.stringify(appData, null, 2)} />
        <div className="prose">
          <h3>User Session</h3>
          <pre>{JSON.stringify({ userSession: rootData.userSession }, null, 2)}</pre>
        </div>
        <div className="prose">
          <h3>Permissions</h3>
          <pre>
            {JSON.stringify(
              {
                isSuperAdmin: appData.isSuperAdmin,
                isSuperUser: appData.isSuperUser,
                permissions: appData.permissions,
              },
              null,
              2
            )}
          </pre>
        </div>
      </div>
    </EditPageLayout>
  );
}

export function ErrorBoundary() {
  return <ServerError />;
}
