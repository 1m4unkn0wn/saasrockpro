// @@@ pwned by 1m4unkn0wn @@@
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { EntityWithCount } from "~/utils/db/entities/entities.db.server";
import SimpleBadge from "../ui/badges/SimpleBadge";
import { Colors } from "~/application/enums/shared/Colors";
import TableSimple from "../ui/tables/TableSimple";
import RelationshipHelper from "~/utils/helpers/RelationshipHelper";
import OrderListButtons from "../ui/sort/OrderListButtons";
import { useEffect, useState } from "react";
import { RowHeaderDisplayDto } from "~/application/dtos/data/RowHeaderDisplayDto";
import { useAppOrAdminData } from "~/utils/data/useAppOrAdminData";

interface Props {
  items: EntityWithCount[];
  selected?: EntityWithCount[];
  onSelected?: (items: EntityWithCount[]) => void;
}

export default function EntitiesTable({ items, selected, onSelected }: Props) {
  const appOrAdminData = useAppOrAdminData();
  const { t } = useTranslation();

  const [headers, setHeaders] = useState<RowHeaderDisplayDto<EntityWithCount>[]>([]);
  useEffect(() => {
    const headers: RowHeaderDisplayDto<EntityWithCount>[] = [
      {
        name: "type",
        title: t("models.entity.type"),
        value: (item) => (
          <SimpleBadge
            title={item.type === "all" ? "app-and-admin" : item.type}
            color={item.type === "app" ? Colors.BLUE : item.type === "admin" ? Colors.GRAY : Colors.EMERALD}
          />
        ),
      },
      {
        title: t("shared.order"),
        name: "order",
        value: (item) => item.order,
        formattedValue: (_, idx) => <OrderListButtons index={idx} items={items} />,
      },
      {
        name: "title",
        title: t("models.entity.title"),
        value: (item) => (
          <div className="flex items-center space-x-1">
            <Link to={"/admin/entities/" + item.slug + "/details"} className="font-medium hover:underline">
              {t(item.titlePlural)}
            </Link>
          </div>
        ),
      },
      {
        name: "properties",
        title: t("models.property.plural"),
        className: "w-full text-xs",
        value: (item) => (
          <div className="max-w-xs truncate">
            {item.properties.filter((f) => !f.isDefault).length > 0 ? (
              <Link className="truncate pb-1 hover:underline" to={"/admin/entities/" + item.slug + "/properties"}>
                {item.properties
                  .filter((f) => !f.isDefault)
                  .map((f) => t(f.title) + (f.isRequired ? "*" : ""))
                  .join(", ")}
              </Link>
            ) : (
              <Link className="truncate pb-1 text-gray-400 hover:underline" to={"/admin/entities/" + item.slug + "/properties"}>
                {t("shared.setCustomProperties")}
              </Link>
            )}
          </div>
        ),
      },
      {
        name: "relationships",
        title: t("models.relationship.plural"),
        value: (item) => (
          <Link className="truncate pb-1 hover:underline" to={"/admin/entities/" + item.slug + "/relationships"}>
            {[...item.parentEntities, ...item.childEntities]
              .map((relationship) => t(RelationshipHelper.getTitleWithName({ fromEntityId: item.id, relationship })))
              .join(", ")}
          </Link>
        ),
        className: "text-xs",
      },
      {
        name: "rows",
        title: t("models.row.plural"),
        value: (item) => (
          <Link to={"/admin/entities/" + item.slug + "/rows"} className="hover:underline">
            {item._count.rows}
          </Link>
        ),
      },
    ];

    if (appOrAdminData.tenantTypes.length > 0) {
      headers.unshift({
        name: "inTypes",
        title: t("models.tenantType.inAccounts"),
        value: (i) => (
          <div className="text-xs">
            {i.inTenantTypes
              .sort((a, b) => ((a.tenantType?.title ?? "") > (b.tenantType?.title ?? "") ? 1 : -1))
              .map((t) => t.tenantType?.title ?? "Default")
              .join(", ")}
          </div>
        ),
      });
    }

    setHeaders(headers);
  }, [appOrAdminData.tenantTypes, items, t]);

  return (
    <div className="space-y-2">
      <TableSimple
        selectedRows={selected}
        onSelected={onSelected}
        items={items}
        actions={[
          {
            title: "No-code",
            onClickRoute: (_, item) => `/admin/entities/${item.slug}/no-code`,
            disabled: (i) => !i.isAutogenerated,
          },
          {
            title: t("shared.edit"),
            onClickRoute: (_, item) => `/admin/entities/${item.slug}/details`,
          },
        ]}
        headers={headers}
      />
    </div>
  );
}
