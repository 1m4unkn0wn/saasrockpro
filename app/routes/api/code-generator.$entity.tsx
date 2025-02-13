// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunctionArgs } from "react-router";
import { getEntityByName } from "~/utils/db/entities/entities.db.server";
import CodeGeneratorService, { CodeGeneratorOptions } from "~/modules/codeGenerator/service/CodeGeneratorService";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  const entity = await getEntityByName({ tenantId: null, name: params.entity! });
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed." }, { status: 405 });
  }
  try {
    const body = (await request.json()) as CodeGeneratorOptions;
    const file = await CodeGeneratorService.generate(body);
    // if (!file) {
    //   return Response.json({ success: "Files generated successfully." }, { status: 200 });
    // }
    return new Response(null, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename=${entity.slug}.zip`,
      },
    });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
};
