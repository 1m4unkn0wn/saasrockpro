// @@@ pwned by 1m4unkn0wn @@@
export type UserProfileUpdatedDto = {
  email: string;
  new: {
    firstName: string;
    lastName: string;
  };
  old: {
    firstName: string;
    lastName: string;
  };
  userId: string;
};
