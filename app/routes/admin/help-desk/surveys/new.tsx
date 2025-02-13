// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunctionArgs, LoaderFunctionArgs, redirect, useActionData } from "react-router";
import { useEffect } from "react";
import toast from "react-hot-toast";
import NewPageLayout from "~/components/ui/layouts/NewPageLayout";
import SurveyForm from "~/modules/surveys/components/SurveyForm";
import { createSurvey } from "~/modules/surveys/db/surveys.db.server";
import { SurveyDto } from "~/modules/surveys/dtos/SurveyDtos";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import { requireAuth } from "~/utils/loaders.middleware";
import { getTenantIdOrNull } from "~/utils/services/.server/urlService";

type LoaderData = {};

export let loader = async ({ request, params }: LoaderFunctionArgs) => {
  await requireAuth({ request, params });
  await verifyUserHasPermission(request, "admin.surveys");
  // let item = { title: "Survey 1" };
  // if (!item) {
  //   return redirect("/admin/help-desk/surveys");
  // }
  const data: LoaderData = {
    // item,
  };
  return data;
};

export let action = async ({ request, params }: ActionFunctionArgs) => {
  await requireAuth({ request, params });
  await verifyUserHasPermission(request, "admin.surveys");
  const tenantId = await getTenantIdOrNull({ request, params });
  const form = await request.formData();
  const action = form.get("action");
  if (action === "create") {
    try {
      const item: SurveyDto = JSON.parse(form.get("item") as string);
      if (!item.title || !item.slug) {
        throw new Error("Title and slug are required");
      } else if (item.items.length === 0) {
        throw new Error("At least one item is required");
      }
      await createSurvey({
        tenantId,
        title: item.title,
        slug: item.slug,
        description: item.description || "",
        isEnabled: item.isEnabled,
        isPublic: item.isPublic,
        minSubmissions: item.minSubmissions,
        image: item.image || null,
        items: item.items.map((item, idx) => ({
          title: item.title,
          description: item.description || "",
          type: item.type,
          order: idx + 1,
          categories: item.categories || [],
          href: item.href || "",
          color: item.color,
          style: item.style || "default",
          options: item.options.map((option) => ({
            title: option.title,
            // link: option.link || "",
            isOther: option.isOther || false,
            icon: option.icon || "",
            shortName: option.shortName || "",
          })),
        })),
      });
      return redirect("/admin/help-desk/surveys");
    } catch (e: any) {
      return Response.json({ error: e.message }, { status: 400 });
    }
  } else if (action === "edit") {
    // edit survey
  }
  return Response.json({ error: "Invalid action" }, { status: 400 });
};

export default function () {
  const actionData = useActionData<{ success?: string; error?: string }>();

  useEffect(() => {
    if (actionData?.success) {
      toast.success(actionData?.success);
    } else if (actionData?.error) {
      toast.error(actionData?.error);
    }
  }, [actionData]);

  return (
    <NewPageLayout
      title={"New Survey"}
      buttons={<></>}
      menu={[
        {
          title: "Surveys",
          routePath: "/admin/help-desk/surveys",
        },
        {
          title: "New",
          routePath: "",
        },
      ]}
    >
      <SurveyForm item={null} />
    </NewPageLayout>
  );
}
