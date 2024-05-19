/**
 * Stopped video at 2:35:40 -> Implemented NextJS Edge middleware and able to get request info. Redirects to settings page if logged in [SUCCESS]
 */
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, publicRoutes, authRoutes } from "./routes";

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  // req.auth
// decide what we want to do with the routes

const isLoggedIn = !!req.auth;
console.log("ROUTE: " + req.nextUrl.pathname)
console.log("IS LOGGED IN: " + isLoggedIn);

const { nextUrl } = req;

//always allow
const isAPiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix); // does it start with /api/auth
const isPublicRoute = publicRoutes.includes(nextUrl.pathname); // is the user trying to access a public route
const isAuthRoute = authRoutes.includes(nextUrl.pathname); // if already logged in and access login Screen, redirect to settings


//allow every API route
if(isAPiAuthRoute){
    return null;
}

// check if we are on auth route
if(isAuthRoute){
    // check login 
    if(isLoggedIn){
        return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    }
    return null;
}

if(!isLoggedIn && !isPublicRoute)
    {
        return Response.redirect(new URL("/auth/login", nextUrl));
    }

    return null;
})
 
// Optionally, don't invoke Middleware on some paths
// with this matcher the entire application is protected by default
export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
}