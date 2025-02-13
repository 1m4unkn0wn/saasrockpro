// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import ServerError from "~/components/ui/errors/ServerError";
import { WorkflowsIdRunStreamApi } from "~/modules/workflowEngine/routes/workflow-engine/__workflow/workflows.$id.run.stream.api.server";
import WorkflowsIdRunStreamView from "~/modules/workflowEngine/routes/workflow-engine/__workflow/workflows.$id.run.stream.view";
import { v2MetaFunction } from "~/utils/compat/v2MetaFunction";

export const meta: v2MetaFunction<WorkflowsIdRunStreamApi.LoaderData> = ({ data }) => data?.metatags || [];
export const loader = (args: LoaderFunctionArgs) => WorkflowsIdRunStreamApi.loader(args);
export const action = (args: ActionFunctionArgs) => WorkflowsIdRunStreamApi.action(args);

export default () => <WorkflowsIdRunStreamView />;

export function ErrorBoundary() {
  return <ServerError />;
}
