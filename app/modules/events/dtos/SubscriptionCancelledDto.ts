// @@@ pwned by 1m4unkn0wn @@@
export type SubscriptionCancelledDto = {
  user: {
    id: string;
    email: string;
  } | null;
  tenant: {
    id: string;
    name: string;
  };
  subscription?: {
    product: {
      id: string;
      title: string;
    };
  };
};
