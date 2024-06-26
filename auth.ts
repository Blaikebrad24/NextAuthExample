import NextAuth, { DefaultSession} from "next-auth"
import { UserRole } from "@prisma/client"
import authConfig from "./auth.config"
import { prismaDB } from "./lib/db"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { getUserById } from "@/data/user"


 
export const { handlers: {GET, POST}, auth, signIn, signOut } = NextAuth({

  callbacks: {

    async signIn({ user })
    {
      const existingUser = await getUserById( user.id);
      if(!existingUser || !existingUser.emailVerified){return false;}

      return true;
    },
    
    async session({ token, session }){
      console.log({ sessionToken : token,})
      // session token.sub is the userID of the current session object
      if(token.sub && session.user)
        {
          session.user.id = token.sub;
        }
        // session.user.customField = "anything"

        if(token.role && session.user)
          {
            session.user.role = token.role as UserRole;
          }
        return session;
    }, 

    async jwt({ token })
    {
      if(!token.sub) {return token;}
      const existingUser = await getUserById(token.sub);
      if(!existingUser){return token;}

      token.role = existingUser.role;
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
