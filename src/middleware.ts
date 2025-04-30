import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/swipe/:path*", "/auth/signin", "/signup", "/"],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const url = request.nextUrl;
  if (
    token &&
    (url.pathname.startsWith("/auth/signin") || url.pathname === "/")
  ) {
    return NextResponse.redirect(new URL("/swipe", request.url));
  }

  if (!token && url.pathname.startsWith("/swipe")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
