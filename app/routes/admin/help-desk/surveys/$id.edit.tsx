// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunctionArgs, LoaderFunctionArgs, redirect, useActionData, useLoaderData } from "react-router";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import NewPageLayout from "~/components/ui/layouts/NewPageLayout";
import { getTranslations } from "~/locale/i18next.server";
import SurveyForm from "~/modules/surveys/components/SurveyForm";
import { SurveyWithDetails, getSurveyById, updateSurvey } from "~/modules/surveys/db/surveys.db.server";
import { SurveyDto } from "~/modules/surveys/dtos/SurveyDtos";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import { requireAuth } from "~/utils/loaders.middleware";
import { getTenantIdOrNull } from "~/utils/services/.server/urlService";

type LoaderData = {
  item: SurveyWithDetails;
};

export let loader = async ({ request, params }: LoaderFunctionArgs) => {
  await requireAuth({ request, params });
  await verifyUserHasPermission(request, "admin.surveys");
  const tenantId = await getTenantIdOrNull({ request, params });
  let item = await getSurveyById({ tenantId, id: params.id! });
  if (!item) {
    return redirect("/admin/help-desk/surveys");
  }
  const data: LoaderData = {
    item,
  };
  return data;
};

export let action = async ({ request, params }: ActionFunctionArgs) => {
  await requireAuth({ request, params });
  await verifyUserHasPermission(request, "admin.surveys");
  const { t } = await getTranslations(request);
  const tenantId = await getTenantIdOrNull({ request, params });
  const form = await request.formData();
  const action = form.get("action");
  if (action === "edit") {
    try {
      const item: SurveyDto = JSON.parse(form.get("item") as string);
      if (!item.title || !item.slug) {
        throw new Error("Title and slug are required");
      } else if (item.items.length === 0) {
        throw new Error("At least one item is required");
      }
      await updateSurvey(params.id!, {
        tenantId,
        title: item.title,
        slug: item.slug,
        description: item.description || "",
        isEnabled: item.isEnabled,
        isPublic: item.isPublic,
        image: item.image || null,
        items: item.items.map((item, idx) => ({
          title: item.title,
          description: item.description || "",
          type: item.type,
          order: idx + 1,
          categories: item.categories || [],
          href: item.href || "",
          color: item.color,
          options: item.options.map((option) => ({
            title: option.title,
            // link: option.link || "",
            isOther: option.isOther || false,
            icon: option.icon || "",
            shortName: option.shortName || "",
          })),
          style: item.style === "grid" ? "grid" : "default",
        })),
        minSubmissions: item.minSubmissions,
      });
      return Response.json({ success: t("shared.updated") });
    } catch (e: any) {
      return Response.json({ error: e.message }, { status: 400 });
    }
  }
  return Response.json({ error: "Invalid action" }, { status: 400 });
};

export default function () {
  const { t } = useTranslation();
  const data = useLoaderData<LoaderData>();
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
      title={"Edit Survey"}
      buttons={<></>}
      menu={[
        {
          title: "Surveys",
          routePath: "/admin/help-desk/surveys",
        },
        {
          title: data.item.title,
          routePath: "",
        },
        {
          title: t("shared.edit"),
          routePath: "",
        },
      ]}
    >
      <SurveyForm item={data.item} />
    </NewPageLayout>
  );
}
