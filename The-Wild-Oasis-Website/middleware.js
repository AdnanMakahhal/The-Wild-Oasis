/*import { NextResponse } from "next/server";

export function middleware(request) {
  console.log(request);

  return NextResponse.redirect(new URL("/about", request.url));
}*/

import NextAuth from "next-auth";
import authConfig from "@/app/_lib/auth.config";
export const middleware = NextAuth(authConfig).auth;

export const config = {
  matcher: ["/account/:path*"],
};
