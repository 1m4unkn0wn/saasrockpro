// @@@ pwned by 1m4unkn0wn @@@
import { Entity, Property, RowValue } from "@prisma/client";

export interface RowDynamicValuesDto {
  form: Entity | undefined;
  name: string;
  total: number;
  headers: (RowValue & { property: Property })[];
  // details: RequestDetailDto[];
}
