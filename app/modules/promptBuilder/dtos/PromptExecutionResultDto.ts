// @@@ pwned by 1m4unkn0wn @@@
import { PromptFlowExecutionWithResults } from "../db/promptExecutions.db.server";
import { PromptFlowOutputResultDto } from "./PromptFlowOutputResultDto";

export type PromptExecutionResultDto = {
  executionResult: PromptFlowExecutionWithResults;
  outputResult: PromptFlowOutputResultDto;
};
