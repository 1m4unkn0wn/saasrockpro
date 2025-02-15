// @@@ pwned by 1m4unkn0wn @@@
export type AccountDeletedDto = {
  tenant: {
    id: string;
    name: string;
  };
  user: {
    id: string;
    email: string;
  };
  subscription?: {
    price: {
      id: string;
      amount: number;
    };
    product: {
      id: string;
      title: string;
    };
  };
};
