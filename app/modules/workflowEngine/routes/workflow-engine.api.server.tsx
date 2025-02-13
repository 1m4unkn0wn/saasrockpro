// @@@ pwned by 1m4unkn0wn @@@
import { LoaderFunctionArgs } from "react-router";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import { getAppConfiguration } from "~/utils/db/appConfiguration.db.server";

export namespace WorkflowEngineApi {
  type LoaderData = {
    metatags: MetaTagsDto;
  };

  export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const appConfiguration = await getAppConfiguration({ request });
    if (params.tenant && !appConfiguration.app.features.tenantWorkflows) {
      throw Response.json({ error: "Workflows are disabled" }, { status: 400 });
    }
    const data: LoaderData = {
      metatags: [{ title: `Workflows | ${process.env.APP_NAME}` }],
    };
    return data;
  };
}
