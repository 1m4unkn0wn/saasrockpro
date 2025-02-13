// @@@ pwned by 1m4unkn0wn @@@
export const getBaseURL = (request: Request, options?: { https?: boolean }) => {
  const url = new URL(request.url);
  if (process.env.NODE_ENV === "development") {
    return `http://${url.host}`;
  }
  if (options?.https || process.env.NODE_ENV === "production") {
    return `https://${url.host}`;
  } else {
    return `${url.protocol}//${url.host}`;
  }
  // if (process.env.SERVER_URL) {
  //   return process.env.SERVER_URL;
  // }
  // if (process.env.VERCEL_URL) {
  //   return `https://${process.env.VERCEL_URL}`;
  // }
  // throw new Error("SERVER_URL or VERCEL_URL environment variable must be set.");
};

export const getDomainName = (request: Request) => {
  const url = new URL(request.url);
  return url.host;
};

export const getWebhooksUrl = (request: Request) => {
  if (process.env.WEBHOOKS_URL) {
    return process.env.WEBHOOKS_URL;
  } else {
    return getBaseURL(request);
  }
};
