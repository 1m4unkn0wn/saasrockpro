// @@@ pwned by 1m4unkn0wn @@@
import { ApiKeyEntityPermissionDto } from "~/application/dtos/apiKeys/ApiKeyEntityPermissionDto";

export type ApiKeyCreatedDto = {
  id: string;
  alias: string;
  expires: Date | null;
  active: boolean;
  entities: ApiKeyEntityPermissionDto[];
  user: {
    id: string;
    email: string;
  };
};
