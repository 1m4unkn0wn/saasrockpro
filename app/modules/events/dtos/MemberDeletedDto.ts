// @@@ pwned by 1m4unkn0wn @@@
export type MemberDeletedDto = {
  tenant: {
    id: string;
    name: string;
  };
  fromUser: {
    id: string;
    email: string;
  };
  user: {
    id: string;
    email: string;
  };
};
