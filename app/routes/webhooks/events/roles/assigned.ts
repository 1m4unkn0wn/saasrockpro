// @@@ pwned by 1m4unkn0wn @@@
import { ActionFunction } from "react-router";
import { RoleAssignedDto } from "~/modules/events/dtos/RoleAssignedDto";

export const action: ActionFunction = async ({ request }) => {
  try {
    if (request.method === "POST") {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const body = (await request.json()) as RoleAssignedDto;
      return Response.json({ message: `${body.fromUser.email} assigned the '${body.toUser.email}' to ${body.role.name}` }, { status: 200 });
    }
  } catch (e: any) {
    return Response.json({ error: e.message }, { status: 400 });
  }
};
