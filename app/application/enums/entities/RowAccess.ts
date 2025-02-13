// @@@ pwned by 1m4unkn0wn @@@
export const RowAccessTypes = ["none", "view", "comment", "edit", "delete"] as const;
export type RowAccess = (typeof RowAccessTypes)[number];
