// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunctionArgs, LoaderFunctionArgs, redirect, useActionData, useLoaderData } from "react-router";
import { Form, Link, useParams, useSubmit } from "react-router";
import clsx from "clsx";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import ButtonPrimary from "~/components/ui/buttons/ButtonPrimary";
import DateCell from "~/components/ui/dates/DateCell";
import ServerError from "~/components/ui/errors/ServerError";
import InputText from "~/components/ui/input/InputText";
import ShowPayloadModalButton from "~/components/ui/json/ShowPayloadModalButton";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import Modal from "~/components/ui/modals/Modal";
import TableSimple from "~/components/ui/tables/TableSimple";
import JsonPropertyValueCell from "~/modules/jsonProperties/components/JsonPropertyValueCell";
import JsonPropertyValuesInput from "~/modules/jsonProperties/components/JsonPropertyValuesInput";
import JsonPropertiesUtils from "~/modules/jsonProperties/utils/JsonPropertiesUtils";
import { WidgetDto } from "~/modules/widgets/dtos/WidgetDto";
import WidgetUtils from "~/modules/widgets/utils/WidgetUtils";
import UrlUtils from "~/utils/app/UrlUtils";
import { useRootData } from "~/utils/data/useRootData";
import { db } from "~/utils/db.server";
import { AppConfiguration, getAppConfiguration } from "~/utils/db/appConfiguration.db.server";
import { getTenantIdFromUrl } from "~/utils/services/.server/urlService";
import { defaultTheme } from "~/utils/theme/defaultThemes";

type LoaderData = {
  items: WidgetDto[];
};
export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const tenantId = await getTenantIdFromUrl(params);
  const data: LoaderData = {
    items: (await db.widget.findMany({ where: { tenantId } })).map((f) => WidgetUtils.toDto(f)),
  };
  return Response.json(data);
};

type ActionData = {
  success?: string;
  error?: string;
};
export const action = async ({ request, params }: ActionFunctionArgs) => {
  const appConfiguration = await getAppConfiguration({ request });
  const tenantId = await getTenantIdFromUrl(params);
  const form = await request.formData();
  const action = form.get("action")?.toString();
  if (action === "create") {
    const name = form.get("name")?.toString() || "";
    const metadata = JsonPropertiesUtils.getValuesFromForm({
      form,
      properties: appConfiguration.widgets?.metadata || [],
      prefix: "metadata",
    });
    const existing = await db.widget.findUnique({
      where: {
        tenantId_name: { tenantId, name },
      },
    });
    if (existing) {
      return Response.json({ error: "Name already taken" }, { status: 400 });
    }
    const appearance: WidgetDto["appearance"] = {
      logo: null,
      theme: defaultTheme,
      mode: "light",
      position: "bottom-right",
      hiddenInUrls: [],
      visibleInUrls: [],
    };
    const item = await db.widget.create({
      data: {
        name,
        tenantId,
        metadata: JSON.stringify(metadata),
        appearance: JSON.stringify(appearance),
      },
    });
    return redirect(UrlUtils.getModulePath(params, `widgets/${item.id}`));
  }
};

export default function () {
  const { t } = useTranslation();
  const { appConfiguration } = useRootData();
  const params = useParams();
  const data = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const [addingWidget, setAddingWidget] = useState(false);

  useEffect(() => {
    if (actionData?.error) {
      toast.error(actionData?.error);
    } else if (actionData?.success) {
      toast.success(actionData?.success);
    }
  }, [actionData]);

  return (
    <EditPageLayout
      title={t("widgets.plural")}
      buttons={
        <>
          <ButtonPrimary onClick={() => setAddingWidget(true)}>{t("shared.new")}</ButtonPrimary>
        </>
      }
    >
      <TableSimple
        items={data.items}
        actions={[
          {
            title: t("shared.edit"),
            onClickRoute(idx, item) {
              return UrlUtils.getModulePath(params, `widgets/${item.id}`);
            },
          },
        ]}
        headers={[
          {
            title: "Title",
            value: (item) => (
              <div>
                <Link to={UrlUtils.getModulePath(params, `widgets/${item.id}`)} className="font-medium hover:underline">
                  {item.name}
                </Link>
              </div>
            ),
          },
          ...(appConfiguration.widgets.metadata
            ?.filter((f) => !f.hideInTable)
            .map((f) => ({
              name: f.name,
              title: f.title,
              value: (item: WidgetDto) => {
                return <JsonPropertyValueCell property={f} value={item.metadata ? item.metadata[f.name] : null} />;
              },
            })) || []),
          {
            title: t("widgets.appearance"),
            value: (item) => (
              <div>
                <ShowPayloadModalButton description="Appearance" payload={JSON.stringify(item.appearance)} />
              </div>
            ),
          },
          {
            title: t("shared.created"),
            value: (item) => <DateCell date={item.createdAt} />,
          },
        ]}
      ></TableSimple>

      <AddWidgetModal appConfiguration={appConfiguration} open={addingWidget} onClose={() => setAddingWidget(false)} />
    </EditPageLayout>
  );
}

function AddWidgetModal({ appConfiguration, open, onClose }: { appConfiguration: AppConfiguration; open: boolean; onClose: () => void }) {
  const { t } = useTranslation();
  const [state, setState] = useState({ name: "" });

  return (
    <Modal open={open} setOpen={onClose} size="md">
      <Form method="post" className="inline-block w-full overflow-hidden bg-white p-1 text-left align-bottom sm:align-middle">
        <input type="hidden" name="action" value="create" readOnly hidden />
        <div className="mt-3 text-center sm:mt-5">
          <h3 className="text-foreground text-lg font-medium leading-6">{t("widgets.create")}</h3>
        </div>
        <div className="mt-4 space-y-2">
          <InputText
            title={t("shared.name")}
            value={state.name}
            setValue={(e) => setState({ ...state, name: e.toString() })}
            type="text"
            name="name"
            id="name"
            placeholder={"Name"}
            required
          />
          <JsonPropertyValuesInput attributes={{}} prefix="metadata" properties={appConfiguration.widgets.metadata || []} />
        </div>
        <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
          <button
            type="submit"
            className={clsx(
              "inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base  font-medium text-white shadow-sm  focus:outline-none focus:ring-2 focus:ring-offset-2 sm:col-start-2 sm:text-sm",
              "bg-foreground text-background"
            )}
          >
            {t("shared.create")}
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
            onClick={onClose}
          >
            {t("shared.back")}
          </button>
        </div>
      </Form>
    </Modal>
  );
}

export function ErrorBoundary() {
  return <ServerError />;
}
