// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunctionArgs, LoaderFunctionArgs, redirect, useActionData, useLoaderData } from "react-router";
import { Form, useNavigation, useParams, useSubmit } from "react-router";
import clsx from "clsx";
import { ClipboardIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Colors } from "~/application/enums/shared/Colors";
import ColorBadge from "~/components/ui/badges/ColorBadge";
import { Button } from "~/components/ui/button";
import ButtonPrimary from "~/components/ui/buttons/ButtonPrimary";
import DateCell from "~/components/ui/dates/DateCell";
import { Input } from "~/components/ui/input";
import InputImage from "~/components/ui/input/InputImage";
import InputMultipleText from "~/components/ui/input/InputMultipleText";
import InputSelect from "~/components/ui/input/InputSelect";
import InputText from "~/components/ui/input/InputText";
import ShowPayloadModalButton from "~/components/ui/json/ShowPayloadModalButton";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import IndexPageLayout from "~/components/ui/layouts/IndexPageLayout";
import ConfirmModal, { RefConfirmModal } from "~/components/ui/modals/ConfirmModal";
import Modal from "~/components/ui/modals/Modal";
import SettingSection from "~/components/ui/sections/SettingSection";
import TableSimple from "~/components/ui/tables/TableSimple";
import { getTranslations } from "~/locale/i18next.server";
import JsonPropertyValuesInput from "~/modules/jsonProperties/components/JsonPropertyValuesInput";
import JsonPropertiesUtils from "~/modules/jsonProperties/utils/JsonPropertiesUtils";
import { WidgetDto } from "~/modules/widgets/dtos/WidgetDto";
import WidgetUtils from "~/modules/widgets/utils/WidgetUtils";
import UrlUtils from "~/utils/app/UrlUtils";
import { useRootData } from "~/utils/data/useRootData";
import { db } from "~/utils/db.server";
import { getAppConfiguration } from "~/utils/db/appConfiguration.db.server";
import { storeSupabaseFile } from "~/utils/integrations/supabaseService";
import { promiseHash } from "~/utils/promises/promiseHash";
import { getTenantIdFromUrl } from "~/utils/services/.server/urlService";
import { defaultTheme, defaultThemes } from "~/utils/theme/defaultThemes";
import { getBaseURL } from "~/utils/url.server";

type LoaderData = {
  item: WidgetDto;
  widgetUrl: string;
};
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const tenantId = await getTenantIdFromUrl(params);
  const item = await db.widget.findUnique({
    where: { id: params.id },
  });
  if (!item || item.tenantId !== tenantId) {
    return redirect(UrlUtils.getModulePath(params, "widgets"));
  }
  const data: LoaderData = {
    item: WidgetUtils.toDto(item),
    widgetUrl: `<script src="${getBaseURL(request)}/embed.js" data-widget-id="${item.id}" data-open-delay="-1" defer async />`,
  };
  return Response.json(data);
};

type ActionData = {
  success?: string;
  error?: string;
};
export const action = async ({ request, params }: ActionFunctionArgs) => {
  const { t } = await getTranslations(request);
  const appConfiguration = await getAppConfiguration({ request });
  const tenantId = await getTenantIdFromUrl(params);
  const form = await request.formData();
  const action = form.get("action")?.toString();
  const item = await db.widget.findUnique({
    where: { id: params.id },
  });
  if (!item || item.tenantId !== tenantId) {
    return redirect(UrlUtils.getModulePath(params, "widgets"));
  }
  if (action === "edit") {
    const name = form.get("name")?.toString() || "";
    const metadata = JsonPropertiesUtils.getValuesFromForm({
      form,
      properties: appConfiguration.widgets?.metadata || [],
      prefix: "metadata",
    });

    if (name !== item.name) {
      const existing = await db.widget.findUnique({
        where: {
          tenantId_name: { tenantId, name },
        },
      });
      if (existing) {
        return Response.json({ error: "Name already taken" }, { status: 400 });
      }
    }
    try {
      await db.widget.update({
        where: { id: item.id },
        data: {
          name,
          metadata: JSON.stringify(metadata),
        },
      });
      return Response.json({ success: t("shared.updated") });
    } catch (e: any) {
      return Response.json({ error: e.message }, { status: 400 });
    }
  } else if (action === "edit-branding") {
    const themeColor = form.get("themeColor")?.toString();
    const themeScheme = form.get("themeScheme")?.toString();
    let logo = form.get("logo")?.toString();
    const position = form.get("position")?.toString();
    const placeholder = form.get("placeholder")?.toString();
    const hiddenInUrls = form.getAll("hiddenInUrls[]").map((f) => f.toString());
    const visibleInUrls = form.getAll("visibleInUrls[]").map((f) => f.toString());

    console.log({ hiddenInUrls, visibleInUrls });

    const { storedLogo } = await promiseHash({
      storedLogo: logo ? storeSupabaseFile({ bucket: "widgets", content: logo, id: `${item.id}-logo.png` }) : Promise.resolve(""),
    });

    const appearance: WidgetDto["appearance"] = {
      theme: themeColor || "",
      mode: themeScheme === "light" ? "light" : "dark",
      logo: storedLogo,
      position: position as any,
      hiddenInUrls,
      visibleInUrls,
    };
    await db.widget.update({
      where: { id: item.id },
      data: {
        appearance: JSON.stringify(appearance),
      },
    });

    return Response.json({ success: t("shared.saved") });
  } else if (action === "delete") {
    await db.widget.delete({
      where: { id: item.id },
    });
    return redirect(UrlUtils.getModulePath(params, "widgets"));
  }
};

export default function () {
  const { t } = useTranslation();
  const { appConfiguration } = useRootData();
  const params = useParams();
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const submit = useSubmit();

  const [item, setItem] = useState<WidgetDto>(data.item);

  const navigation = useNavigation();
  const isDeleting = navigation.state === "submitting";

  const confirmDelete = useRef<RefConfirmModal>(null);

  const textToType = `${t("shared.delete")} ${data.item.name}`;
  const [typeToConfirm, setTypeToConfirm] = useState<string>("");

  useEffect(() => {
    setItem(data.item);
  }, [data.item]);

  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData?.error);
    } else if (actionData?.success) {
      toast.success(actionData?.success);
    }
  }, [actionData]);

  function onDelete() {
    confirmDelete.current?.show(t("shared.delete"), t("shared.delete"), t("shared.cancel"), t("shared.warningCannotUndo"));
  }

  function onConfirmDelete() {
    const form = new FormData();
    form.append("action", "delete");
    submit(form, {
      method: "post",
    });
  }

  return (
    <EditPageLayout
      title={item.name}
      withHome={false}
      menu={[
        {
          title: t("widgets.plural"),
          routePath: UrlUtils.getModulePath(params, `widgets`),
        },
        {
          title: data.item.name,
        },
      ]}
    >
      <div className="pb-20">
        <SettingSection title="Details">
          <div className="mt-5 md:col-span-2 md:mt-0">
            <Form method="post">
              <input hidden type="text" name="action" value="edit" readOnly />
              <div className="">
                <div className=" space-y-2">
                  <div className="grid grid-cols-6 gap-2">
                    <div className="col-span-6 sm:col-span-6 md:col-span-6">
                      <label htmlFor="name" className="mb-1 block text-sm font-medium leading-5 text-gray-700">
                        {t("shared.name")}
                      </label>
                      <Input name="name" required type="text" defaultValue={data.item.name} />
                    </div>
                  </div>
                  <JsonPropertyValuesInput attributes={data.item.metadata} prefix="metadata" properties={appConfiguration.widgets.metadata || []} />
                </div>
                <div className="mt-3">
                  <div className="flex justify-between">
                    <div></div>
                    <ButtonPrimary type="submit">{t("shared.save")}</ButtonPrimary>
                  </div>
                </div>
              </div>
            </Form>
          </div>
        </SettingSection>

        {/*Separator */}
        <div className="block">
          <div className="py-5">
            <div className="border-border border-t"></div>
          </div>
        </div>

        {/*  */}
        <SettingSection title="Embed">
          <div>
            <div className="flex items-center justify-between space-x-2">
              <div className="text-muted-foreground text-sm">
                Place the following script inside the <code>&lt;head&gt;</code> tag of your website.
              </div>
              <Button
                type="button"
                variant="outline"
                className=""
                onClick={() => {
                  navigator.clipboard.writeText(data.widgetUrl);
                  toast.success(t("shared.copied"));
                }}
              >
                <ClipboardIcon className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
            <div className="mt-2">
              <InputText rows={2} className="bg-secondary" defaultValue={data.widgetUrl} readOnly />
            </div>
          </div>
        </SettingSection>

        {/*Separator */}
        <div className="block">
          <div className="py-5">
            <div className="border-border border-t"></div>
          </div>
        </div>

        <SettingSection title="Appearance">
          <Form method="post">
            <input type="hidden" name="action" value="edit-branding" readOnly hidden />
            <div className="space-y-2">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-6 sm:gap-x-3">
                <div className="sm:col-span-2">
                  <InputSelect
                    name="themeColor"
                    title="Theme Color"
                    value={item.appearance.theme}
                    setValue={(e) => {
                      setItem({
                        ...item,
                        appearance: {
                          ...item.appearance,
                          theme: e?.toString() || "",
                        },
                      });
                    }}
                    placeholder={t("shared.select") + "..."}
                    options={defaultThemes.map((item) => ({
                      name: item.name,
                      value: item.value,
                      component: (
                        <div className="flex items-center space-x-2">
                          <div
                            className={clsx(
                              `theme-${item.value}`,
                              " bg-primary text-primary inline-flex flex-shrink-0 items-center rounded-full text-xs font-medium"
                            )}
                          >
                            <svg className={clsx("h-2 w-2")} fill="currentColor" viewBox="0 0 8 8">
                              <circle cx={4} cy={4} r={3} />
                            </svg>
                          </div>
                          <div>{item.name}</div>
                        </div>
                      ),
                    }))}
                  />
                </div>
                <div className="sm:col-span-2">
                  <InputSelect
                    name="themeScheme"
                    title="Theme Scheme"
                    value={item.appearance.mode}
                    setValue={(e) => {
                      setItem({
                        ...item,
                        appearance: {
                          ...item.appearance,
                          mode: e === "light" ? "light" : "dark",
                        },
                      });
                    }}
                    placeholder={t("shared.select") + "..."}
                    options={[
                      {
                        name: t("shared.light"),
                        value: "light",
                      },
                      {
                        name: t("shared.dark"),
                        value: "dark",
                      },
                    ]}
                  />
                </div>
                <div className="sm:col-span-2">
                  <InputSelect
                    name="position"
                    title="Position"
                    defaultValue={item.appearance.position}
                    options={[
                      {
                        name: "Bottom Right",
                        value: "bottom-right",
                      },
                      {
                        name: "Bottom Left",
                        value: "bottom-left",
                      },
                      {
                        name: "Top Right",
                        value: "top-right",
                      },
                      {
                        name: "Top Left",
                        value: "top-left",
                      },
                    ]}
                  />
                </div>
                <div className="sm:col-span-6">
                  <InputImage name="logo" title={t("shared.logo")} defaultValue={item.appearance.logo || ""} />
                </div>

                <div className="sm:col-span-3">
                  <InputMultipleText
                    name="hiddenInUrls[]"
                    title="Hide in URLs"
                    value={item.appearance.hiddenInUrls}
                    onChange={(e) => {
                      setItem({
                        ...item,
                        appearance: {
                          ...item.appearance,
                          hiddenInUrls: e.map((i) => {
                            i = i.trim();
                            return "/" + UrlUtils.slugify(i);
                          }),
                        },
                      });
                    }}
                    placeholder="/docs would hide URLs starting with /docs"
                    separator="Enter"
                  />
                </div>

                <div className="sm:col-span-3">
                  <InputMultipleText
                    name="visibleInUrls[]"
                    title="Only show in URLs"
                    value={item.appearance.visibleInUrls}
                    onChange={(e) => {
                      setItem({
                        ...item,
                        appearance: {
                          ...item.appearance,
                          visibleInUrls: e.map((i) => {
                            i = i.trim();
                            return "/" + UrlUtils.slugify(i);
                          }),
                        },
                      });
                    }}
                    placeholder="/docs would show URLs starting with /docs"
                    separator="Enter"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <ButtonPrimary type="submit">{t("shared.save")}</ButtonPrimary>
              </div>
            </div>
          </Form>
        </SettingSection>

        {/*Separator */}
        <div className="block">
          <div className="py-5">
            <div className="border-border border-t"></div>
          </div>
        </div>

        <SettingSection title={t("settings.danger.title")} description={t("settings.danger.description")}>
          <div className="mt-12 space-y-2 md:col-span-2 md:mt-0">
            <div>
              <InputText title={`Type "${textToType}" to confirm`} value={typeToConfirm} setValue={setTypeToConfirm} />
            </div>
            <div>
              <ButtonPrimary
                disabled={typeToConfirm !== textToType || isDeleting}
                className={clsx(isDeleting && "base-spinner")}
                destructive={true}
                onClick={onDelete}
              >
                {t("shared.delete")}
              </ButtonPrimary>
            </div>
          </div>
        </SettingSection>
      </div>

      <ConfirmModal ref={confirmDelete} destructive onYes={onConfirmDelete} />
    </EditPageLayout>
  );
}
