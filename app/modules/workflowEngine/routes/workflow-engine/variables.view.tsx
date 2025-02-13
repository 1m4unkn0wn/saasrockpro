// @@@ pwned by 1m4unkn0wn @@@
import { Outlet, useLoaderData } from "react-router";
import ButtonPrimary from "~/components/ui/buttons/ButtonPrimary";
import DateCell from "~/components/ui/dates/DateCell";
import EditPageLayout from "~/components/ui/layouts/EditPageLayout";
import TableSimple from "~/components/ui/tables/TableSimple";
import { WorkflowsVariablesApi } from "./variables.api.server";

export default function WorkflowsVariablesView() {
  const data = useLoaderData<WorkflowsVariablesApi.LoaderData>();

  return (
    <EditPageLayout
      title="Variables"
      buttons={
        <>
          <ButtonPrimary to="new">New</ButtonPrimary>
        </>
      }
    >
      <div className="space-y-3">
        <TableSimple
          headers={[
            {
              title: "Name",
              name: "name",
              value: (item) => `{{$vars.${item.name}}}`,
            },
            {
              title: "Value",
              name: "value",
              className: "w-full",
              value: (item) => item.value,
            },
            {
              title: "Created At",
              name: "createdAt",
              value: (item) => <DateCell date={item.createdAt} />,
            },
          ]}
          items={data.items}
          actions={[
            {
              title: "Edit",
              onClickRoute: (idx, item) => item.id,
            },
          ]}
        />
      </div>
      <Outlet />
    </EditPageLayout>
  );
}
