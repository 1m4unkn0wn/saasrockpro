// @@@ pwned by 1m4unkn0wn @@@
import { LoaderFunctionArgs, redirect, ActionFunction } from "react-router";
import { MetaTagsDto } from "~/application/dtos/seo/MetaTagsDto";
import { EntitiesApi } from "~/utils/api/.server/EntitiesApi";
import { RowsApi } from "~/utils/api/.server/RowsApi";
import UrlUtils from "~/utils/app/UrlUtils";
import { EntityWithDetails, getAllEntities } from "~/utils/db/entities/entities.db.server";
import EntityHelper from "~/utils/helpers/EntityHelper";
import { getEntityPermission } from "~/utils/helpers/PermissionsHelper";
import { verifyUserHasPermission } from "~/utils/helpers/.server/PermissionsService";
import RowHelper from "~/utils/helpers/RowHelper";
import { getUserInfo } from "~/utils/session.server";
import RowsRequestUtils from "../utils/RowsRequestUtils";
import { createMetrics } from "~/modules/metrics/services/.server/MetricTracker";
import FormulaService from "~/modules/formulas/services/.server/FormulaService";
import { RowWithDetails } from "~/utils/db/entities/rows.db.server";

export namespace Rows_New {
  export type LoaderData = {
    meta: MetaTagsDto;
    entityData: EntitiesApi.GetEntityData;
    routes: EntitiesApi.Routes;
    allEntities: EntityWithDetails[];
    relationshipRows: RowsApi.GetRelationshipRowsData;
  };
  export const loader = async ({ request, params }: LoaderFunctionArgs) => {
    const { time, getServerTimingHeader } = await createMetrics({ request, params }, `[Rows_New] ${params.entity}`);
    const { t, userId, tenantId, entity } = await RowsRequestUtils.getLoader({ request, params });
    if (!entity.isAutogenerated || entity.type === "system") {
      throw redirect(tenantId ? UrlUtils.currentTenantUrl(params, "404") : "/404", { status: 404, headers: getServerTimingHeader() });
    }
    const entityData = await time(
      EntitiesApi.get({
        entity,
        tenantId,
        userId,
      }),
      "EntitiesApi"
    );
    await time(verifyUserHasPermission(request, getEntityPermission(entity, "create"), tenantId), "verifyUserHasPermission");
    const data: LoaderData = {
      meta: [{ title: `${t("shared.create")} ${t(entity.title)} | ${process.env.APP_NAME}` }],
      entityData,
      routes: EntitiesApi.getNoCodeRoutes({ request, params }),
      allEntities: await time(getAllEntities({ tenantId, active: true }), "getAllEntities"),
      relationshipRows: await time(RowsApi.getRelationshipRows({ entity, tenantId, userId }), "RowsApi.getRelationshipRows"),
    };
    return Response.json(data, { headers: getServerTimingHeader() });
  };

  export type ActionData = {
    saveAndAdd?: boolean;
    newRow?: RowWithDetails;
    error?: string;
  };
  export const action: ActionFunction = async ({ request, params }) => {
    const { time, getServerTimingHeader } = await createMetrics({ request, params }, `[Rows_New] ${params.entity}`);
    const { t, userId, tenantId, entity, form } = await RowsRequestUtils.getAction({ request, params });
    const action = form.get("action");
    if (action === "create") {
      try {
        await time(verifyUserHasPermission(request, getEntityPermission(entity, "create"), tenantId), "verifyUserHasPermission");
        const rowValues = RowHelper.getRowPropertiesFromForm({ t: t, entity, form });
        const newRow = await time(
          RowsApi.create({
            entity,
            tenantId,
            userId: (await getUserInfo(request)).userId,
            rowValues,
            request,
          }),
          "RowsApi.create"
        );
        await time(
          FormulaService.trigger({ trigger: "AFTER_CREATED", rows: [newRow], entity: entity, session: { tenantId, userId }, t }),
          "FormulaService.trigger.AFTER_CREATED"
        );
        const onCreatedRedirect = form.get("onCreatedRedirect");
        if (onCreatedRedirect) {
          if (onCreatedRedirect === "addAnother") {
            return Response.json({ saveAndAdd: true, newRow, headers: getServerTimingHeader() });
          }
          const routes = EntityHelper.getRoutes({ routes: EntitiesApi.getNoCodeRoutes({ request, params }), entity, item: newRow });
          if (routes) {
            if (!entity.onCreated || entity.onCreated === "redirectToOverview") {
              return redirect(routes?.overview ?? "", { headers: getServerTimingHeader() });
            } else if (entity.onCreated === "redirectToEdit") {
              return redirect(routes?.edit ?? "", { headers: getServerTimingHeader() });
            } else if (entity.onCreated === "redirectToList") {
              return redirect(routes?.list ?? "", { headers: getServerTimingHeader() });
            } else if (entity.onCreated === "redirectToNew") {
              return Response.json({ newRow, replace: true }, { headers: getServerTimingHeader() });
            } else if (params.group && entity.onCreated === "redirectToGroup") {
              return redirect(routes?.group ?? "", { headers: getServerTimingHeader() });
            }
          }
        }
        const redirectTo = form.get("redirect")?.toString() || new URL(request.url).searchParams.get("redirect")?.toString();
        if (redirectTo) {
          return redirect(redirectTo, { headers: getServerTimingHeader() });
        }
        return Response.json({ newRow, headers: getServerTimingHeader() });
      } catch (error: any) {
        return Response.json({ error: error.message }, { status: 400, headers: getServerTimingHeader() });
      }
    } else {
      return Response.json({ error: t("shared.invalidForm") }, { status: 400, headers: getServerTimingHeader() });
    }
  };
}
