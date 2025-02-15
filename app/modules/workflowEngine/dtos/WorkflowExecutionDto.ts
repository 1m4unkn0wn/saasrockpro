// @@@ pwned by 1m4unkn0wn @@@
import { WorkflowBlockDto } from "./WorkflowBlockDto";
import { WorkflowBlockExecutionDto } from "./WorkflowBlockExecutionDto";
import { WorkflowStatus } from "./WorkflowStatus";

export type WorkflowExecutionDto = {
  id: string;
  createdAt: Date;
  status: WorkflowStatus;
  input: { [key: string]: any } | null;
  output: { [key: string]: any } | null;
  duration: number | null;
  endedAt: Date | null;
  error: string | null;
  blockRuns: WorkflowBlockExecutionDto[];
  executionAlerts: { type: "success" | "error"; message: string }[];
  waitingBlock: WorkflowBlockDto | null;
};
