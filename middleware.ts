import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "./middlewares/apis/authMiddleware";
import { cookies } from "next/headers";
import { isRouteProtected } from "./utils/checkProtectedRoutes";

export const config = {
  matcher: ["/api/:path*"],
};

export default async function middleware(request: NextRequest) {
  const cookieStore = cookies();
  const userData = JSON.parse(cookieStore.get("userData")?.value || "{}");

  // check if the token is present or not
  if (
    (!userData.token || userData.token.length <= 0) &&
    !request.nextUrl.pathname.toLowerCase().includes("/api")
  ) {
    const ABSOLUTE_URL = new URL("/login", request.nextUrl.origin);
    return NextResponse.redirect(ABSOLUTE_URL.toString());
  }

  // check if the route that you are accessing is protected and the method for it is eigther POST, PUT OR DELETE
  if (
    isRouteProtected(request.url) &&
    (request.method === "POST" ||
      request.method === "PUT" ||
      request.method === "DELETE")
  ) {
    // get the authResult form the authMiddleware
    const authResult = await authMiddleware(request);
    // if it is false then return access denined
    if (!authResult.isValid) {
      return new NextResponse(JSON.stringify({ message: "Unauthorized!" }), {
        status: 401,
      });
    }
  }

  return NextResponse.next();
}
