// @@@ pwned by 1m4unkn0wn @@@
export type RoleUnassignedDto = {
  fromUser: {
    id: string;
    email: string;
  };
  toUser: {
    id: string;
    email: string;
  };
  role: {
    id: string;
    name: string;
    description: string;
  };
};
