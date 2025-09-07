import NextAuth from "next-auth";
import {
    DEFAULT_LOGIN_REDIRECT,
    apiAuthPrefix,
    authRoutes,
    protectedRoutes,
    publicRoutes
} from "./routes";
import authConfig from "./auth.config";

const {auth} = NextAuth(authConfig)

export default auth((req)=>{
    const {nextUrl} = req;
    const isLoggedIn = !!req.auth

    const isApiRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname); // Fixed: should be authRoutes, not protectedRoutes
    const isProtectedRoute = protectedRoutes.includes(nextUrl.pathname);

    // Don't redirect API routes
    if(isApiRoute){
        return null;
    }

    // If user is logged in and trying to access auth pages (login/register)
    // Redirect them to dashboard/home
    if (isAuthRoute && isLoggedIn) {  
        return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }

    // If user is not logged in and trying to access protected routes
    // Redirect them to login
    if (isProtectedRoute && !isLoggedIn) {
        return Response.redirect(new URL("/auth/sign-in", nextUrl));
    }

    // If user is not logged in and trying to access a route that's NOT public
    // Redirect them to login (this handles routes not explicitly defined)
    if (!isLoggedIn && !isPublicRoute && !isAuthRoute) {
        return Response.redirect(new URL("/auth/sign-in", nextUrl));
    }

    return null;
});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/","/(api|trpc)(.*)"],
};