// @@@ pwned by 1m4unkn0wn @@@
export type RowCommentsReactedDto = {
  rowId: string;
  reaction: string;
  comment: {
    id: string;
    text: string;
  };
  user: {
    id: string;
    email: string;
  } | null;
};
