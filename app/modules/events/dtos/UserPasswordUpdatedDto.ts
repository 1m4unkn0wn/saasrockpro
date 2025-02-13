// @@@ pwned by 1m4unkn0wn @@@
export type UserPasswordUpdatedDto = {
  user: {
    id: string;
    email: string;
  };
  fromUser?: {
    id: string;
    email: string;
  };
};
