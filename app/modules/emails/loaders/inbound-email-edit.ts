// @@@ pwned by 1m4unkn0wn @@@
import { EmailRead } from "@prisma/client";
import { redirect } from "react-router";
import { Params } from "react-router";
import { createEmailRead, EmailWithDetails, getEmail, getEmailReads } from "~/utils/db/email/emails.db.server";
import { requireAuth } from "~/utils/loaders.middleware";
import { getUserInfo } from "~/utils/session.server";

export type LoaderDataInboundEmailEdit = {
  item: EmailWithDetails;
  myRead: EmailRead;
  redirectUrl: string;
};
export const loaderEmailEdit = async (request: Request, params: Params, tenantId: string | null, redirectUrl: string) => {
  await requireAuth({ request, params });
  const userInfo = await getUserInfo(request);
  const item = await getEmail(params.id ?? "", tenantId);
  if (!item) {
    throw redirect(redirectUrl);
  }
  const myReads = await getEmailReads(params.id ?? "", userInfo.userId);
  let myRead: EmailRead | null = null;
  if (myReads.length === 0) {
    myRead = await createEmailRead(item.id, userInfo.userId);
  } else {
    myRead = myReads[0];
  }
  const data: LoaderDataInboundEmailEdit = {
    item,
    myRead,
    redirectUrl,
  };
  return data;
};
