// @@@ pwned by 1m4unkn0wn @@@
export type EmailTemplate = {
  type: "standard" | "layout";
  name: string;
  alias: string;
  subject: string;
  htmlBody: string;
  active: boolean;
  associatedServerId: number;
  templateId: number;
};
