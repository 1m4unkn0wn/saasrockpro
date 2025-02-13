// @@@ pwned by 1m4unkn0wn @@@
export type UserPreferencesUpdatedDto = {
  new: {
    locale: string;
  };
  old: {
    locale: string;
  };
  user: {
    id: string;
    email: string;
  };
};
