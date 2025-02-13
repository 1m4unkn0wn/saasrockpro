// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunction } from "react-router";
import { AccountCreatedDto } from "~/modules/events/dtos/AccountCreatedDto";

export const action: ActionFunction = async ({ request }) => {
  try {
    if (request.method === "POST") {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const body = (await request.json()) as AccountCreatedDto;
      return Response.json({ message: `Account created: ${body.tenant.name}` }, { status: 200 });
    }
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 400 });
  }
};
