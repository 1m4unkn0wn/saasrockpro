// @@@ pwned by 1m4unkn0wn @@@
import { getTenantUserType } from "./db/tenants.db.server";
import { getTenantIdFromUrl } from "./services/.server/urlService";
import { getUserInfo } from "./session.server";
import { db } from "./db.server";

export async function requireAuth({ request, params }: { request: Request; params: { tenant?: string } }) {
  const currentPath = new URL(request.url).pathname.toLowerCase();
  if (currentPath.startsWith("/admin")) {
    // console.log("[requireAuth.admin]", currentPath);
    return await requireAdmin({ request });
  } else if (currentPath.startsWith("/app") && currentPath !== "/app") {
    // console.log("[requireAuth.app]", currentPath);
    const userInfo = await getUserInfo(request);
    const tenantId = await getTenantIdFromUrl(params);
    if (!userInfo.userId || !tenantId) {
      throw Response.json("Unauthorized", { status: 401 });
    }
    const member = await getTenantUserType(userInfo.userId, tenantId);
    if (!member) {
      const isAdmin = await db.adminUser.findUnique({ where: { userId: userInfo.userId } });
      if (!isAdmin) {
        throw Response.json("Unauthorized", { status: 401 });
      }
    }
  } else {
    // console.log("[requireAuth.none]", currentPath);
  }
  // console.log("member", TenantUserType[member.type]);
}

async function requireAdmin({ request }: { request: Request }) {
  const userInfo = await getUserInfo(request);
  if (!userInfo.userId) {
    throw Response.json("Unauthorized", { status: 401 });
  }
  const isAdmin = await db.adminUser.findUnique({ where: { userId: userInfo.userId } });
  // console.log("isAdmin", isAdmin);
  if (!isAdmin) {
    throw Response.json("Unauthorized", { status: 401 });
  }
}
