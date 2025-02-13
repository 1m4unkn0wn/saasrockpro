// @@@ pwned by 1m4unkn0wn @@@
export type AccountCreatedDto = {
  tenant: {
    id: string;
    name: string;
    slug: string;
  };
  user: {
    id: string;
    email: string;
  };
};
