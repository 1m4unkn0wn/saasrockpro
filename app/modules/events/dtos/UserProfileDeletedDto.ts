// @@@ pwned by 1m4unkn0wn @@@
import { AccountDeletedDto } from "./AccountDeletedDto";

export type UserProfileDeletedDto = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  deletedAccounts?: AccountDeletedDto[];
};
