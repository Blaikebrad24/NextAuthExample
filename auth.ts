import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { prismaDB } from "./lib/db"
import { PrismaAdapter } from "@auth/prisma-adapter"
 
export const { handlers: {GET, POST}, auth, signIn, signOut } = NextAuth({

  callbacks: {
    async session({ token, session }){
      // session token.sub is the userID of the current session object
      if(token.sub && session.user)
        {
          session.user.id = token.sub;
        }
        return session;
    }, 

    async jwt({ token })
    {
      return token;
    }
  },
  adapter: PrismaAdapter(prismaDB),
  session: { strategy: "jwt"},
  ...authConfig,  

})

// NextJS middleware runs on NextJS Edge Function runtime
// edge functions in cloud computing are serverless functions
// (i.e. Azure functions, AWS Lambda etc) and are deployed in a
// CDN (Content Delivery Network) to handle requests based on geography 
// to reduce latency
// Although, prisma ORM (Object Relational Mapping) is not compatible with Edge Functions
// so using the "database" session strategy wont work
// Edge Runtime so we need to split up the configuration so that the 
// prisma object does not try and access the database in edge environments, aka middleware
