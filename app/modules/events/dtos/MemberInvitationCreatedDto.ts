// @@@ pwned by 1m4unkn0wn @@@
export type MemberInvitationCreatedDto = {
  tenant: {
    id: string;
    name: string;
  };
  user: {
    email: string;
    firstName: string;
    lastName: string;
    type: string;
  };
  fromUser: {
    id: string;
    email: string;
  };
};
