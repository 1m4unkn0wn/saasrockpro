// @@@ pwned by 1m4unkn0wn @@@
import { LoaderFunctionArgs } from "react-router";
import jwt from "jsonwebtoken";
import { getUser } from "~/utils/db/users.db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return Response.json({ error: "No token provided" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const user = await getUser(decoded.userId);
    return Response.json({ user });
  } catch (e: any) {
    return Response.json({ error: "Token is not valid or expired: " + e.message }, { status: 401 });
  }
};
