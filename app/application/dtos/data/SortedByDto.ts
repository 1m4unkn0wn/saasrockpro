// @@@ pwned by 1m4unkn0wn @@@
import { Entity, Property } from "@prisma/client";

export interface SortedByDto {
  name: string;
  direction: "asc" | "desc";
  property?: Property;
  entity?: Entity;
}
