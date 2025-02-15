// @@@ pwned by 1m4unkn0wn @@@
export type InboundEmailDto = {
  From: string;
  FromName: string;
  FromFull: { Email: string; Name: string };
  To: string;
  ToFull: { Email: string; Name: string }[];
  Cc: string;
  CcFull: { Email: string; Name: string }[];
  Bcc: string;
  BccFull: { Email: string; Name: string }[];
  ReplyTo: string;
  OriginalRecipient: string;
  Subject: string;
  Date: string;
  MailboxHash: string;
  Tag?: string;
  MessageID: string;
  Status: string;
  Attachments: { Name: string; ContentID: string | null; Content: string; ContentType: string; ContentLength?: number }[];
  MessageStream: string;
};
