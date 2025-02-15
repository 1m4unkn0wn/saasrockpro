// @@@ pwned by 1m4unkn0wn @@@
export type SubscriptionSubscribedDto = {
  user: {
    id: string;
    email: string;
  } | null;
  tenant: {
    id: string;
    name: string;
    slug: string;
  };
  subscription: {
    product: {
      id: string;
      title: string;
    };
    session?: string;
  };
};
