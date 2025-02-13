// @@@ pwned by 1m4unkn0wn @@@
import { useLoaderData, useNavigate, useParams } from "react-router";
import WorkflowVariableForm from "~/modules/workflowEngine/components/workflowVariables/WorkflowVariableForm";
import UrlUtils from "~/utils/app/UrlUtils";
import SlideOverWideEmpty from "~/components/ui/slideOvers/SlideOverWideEmpty";
import { WorkflowsVariablesIdApi } from "./variables.$id.api.server";

export default function WorkflowsVariablesIdView() {
  const data = useLoaderData<WorkflowsVariablesIdApi.LoaderData>();
  const params = useParams();
  const navigate = useNavigate();
  function close() {
    navigate(UrlUtils.getModulePath(params, `workflow-engine/variables`));
  }
  return (
    <SlideOverWideEmpty title="Edit Variable" className="sm:max-w-sm" open={true} onClose={close}>
      <WorkflowVariableForm item={data.item} />
    </SlideOverWideEmpty>
  );
}
