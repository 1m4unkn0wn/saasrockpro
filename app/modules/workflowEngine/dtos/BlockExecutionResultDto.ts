// @@@ pwned by 1m4unkn0wn @@@
export type BlockExecutionResultDto = {
  output: { [key: string]: any } | any | null;
  toBlockIds: string[];
  error?: string | null;
  throwsError?: boolean;
};
