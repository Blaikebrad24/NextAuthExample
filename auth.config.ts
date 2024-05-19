import GitHub from "next-auth/providers/github"
import type { NextAuthConfig } from "next-auth"
 
export default { providers: [GitHub] } satisfies NextAuthConfig


// this will trigger NextJS Middleware instead of auth.ts