// @@@ pwned by 1m4unkn0wn @@@
import { LoaderFunctionArgs, useLoaderData } from "react-router";
import ApiSpecsService, { ApiSpecsDto } from "~/modules/api/services/ApiSpecsService";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import ApiSpecs from "~/modules/api/components/ApiSpecs";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";

type LoaderData = {
  apiSpecs: ApiSpecsDto;
};
export const loader = async ({ request }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.entities.view");
  const data: LoaderData = {
    apiSpecs: await ApiSpecsService.generateSpecs({ request }),
  };
  return data;
};

export default function () {
  const data = useLoaderData<LoaderData>();

  return (
    <EditPageLayout title="API Docs">
      <ApiSpecs item={data.apiSpecs} />
    </EditPageLayout>
  );
}
