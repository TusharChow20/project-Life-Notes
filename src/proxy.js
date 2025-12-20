import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
const privateRoutes = ["/add-lesson", "/my-lessons"];
// This function can be marked `async` if using `await` inside
export async function proxy(request) {
  //
  const token = await getToken({ req: request });
  // console.log(token);

  const reqPath = request.nextUrl.pathname;
  const isPrivate = privateRoutes.some((route) => reqPath.startsWith(route));
  const isAuthenticated = Boolean(token);
  // console.log({ reqPath, isPrivate });

  if (!isAuthenticated && isPrivate) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", reqPath);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Alternatively, you can use a default export:
// export default function proxy(request) { ... }

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/add-lesson/:path*", "/my-lessons/:path*"],
};
