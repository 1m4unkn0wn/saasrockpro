// @@@ pwned by 1m4unkn0wn @@@
export const PromptFlowVariableTypes = [
  { name: "Text", value: "text" },
  { name: "Number", value: "number" },
] as const;
export type PromptFlowVariableType = (typeof PromptFlowVariableTypes)[number]["value"];
