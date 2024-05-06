
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/api/uploadthing", "/", "sign-in", "sign-up", "/pricing"
])

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req)) return
  auth().protect();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};