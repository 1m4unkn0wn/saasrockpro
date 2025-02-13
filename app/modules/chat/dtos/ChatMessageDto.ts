// @@@ pwned by 1m4unkn0wn @@@
export type ChatMessageDto = {
  position: "left" | "right";
  data:
    | { text: string }
    | { error: string }
    | { loading: boolean }
    | {
        file: { file: string; name: string; type: string };
      };
  createdAt: Date;
};
