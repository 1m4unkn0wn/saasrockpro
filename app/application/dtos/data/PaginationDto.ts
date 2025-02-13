// @@@ pwned by 1m4unkn0wn @@@
import { SortedByDto } from "./SortedByDto";

export interface PaginationDto {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  sortedBy?: SortedByDto[];
  query?: string | undefined;
}
