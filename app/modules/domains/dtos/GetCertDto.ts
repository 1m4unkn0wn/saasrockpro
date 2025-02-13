// @@@ pwned by 1m4unkn0wn @@@
export type GetCertDto = {
  configured: boolean;
  records?: {
    A?: { name: string; value: string };
    AAAA?: { name: string; value: string };
    CNAME?: { name: string; value: string };
  };
};
