// @@@ pwned by 1m4unkn0wn @@@
import { LoaderFunctionArgs, useLoaderData } from "react-router";
import { ApiEndpointDto } from "~/modules/api/dtos/ApiEndpointDto";
import ApiSpecsService from "~/modules/api/services/ApiSpecsService";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import ApiSpecs from "~/modules/api/components/ApiSpecs";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";

type LoaderData = {
  apiSpecs: {
    endpoints?: ApiEndpointDto[];
    openApi: any;
    postmanCollection?: any;
  };
};
export const loader = async ({ request }: LoaderFunctionArgs) => {
  await verifyUserHasPermission(request, "admin.apiKeys.view");
  const apiSpecs = await ApiSpecsService.generateSpecs({ request });
  const data: LoaderData = {
    apiSpecs,
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
