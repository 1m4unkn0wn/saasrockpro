// @@@ pwned by 1m4unkn0wn @@@
export type RowCommentsDeletedDto = {
  rowId: string;
  comment: {
    id: string;
    text: string;
  };
  user: {
    id: string;
    email: string;
  } | null;
};
