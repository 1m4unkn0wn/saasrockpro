// @@@ pwned by 1m4unkn0wn @@@
import { FilterablePropertyDto } from "./FilterablePropertyDto";

export interface FiltersDto {
  properties: FilterablePropertyDto[];
  query?: string | null;
}
