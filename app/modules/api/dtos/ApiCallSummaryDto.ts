// @@@ pwned by 1m4unkn0wn @@@
export type ApiCallSummaryDto = {
  tenantId: string | null;
  method: string;
  endpoint: string;
  params: string;
  status: number;
  _avg: { duration: number | null };
  _count: { _all: number };
};
