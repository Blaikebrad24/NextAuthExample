import NextAuth, { DefaultSession} from "next-auth"
import { UserRole } from "@prisma/client"
import authConfig from "./auth.config"
import { prismaDB } from "./lib/db"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { getUserById } from "@/data/user" 


export const { handlers: {GET, POST}, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }){
      await prismaDB.user.update({
        where: { id: user.id }, 
        data: { emailVerified: new Date()}
      })
    }
  },
  callbacks: { // do the same things in callbacks as login & register function
    async signIn({ user, account}){
      if(account?.provider !== "credentials") {return true;} // Allow OAuth for providers w/o email verification

      const existingUser = await getUserById(user.id!);


      // prevent signin w/o verification
      if(!existingUser?.emailVerified){return false;} // if email not verified then block

      // TODO: Add 2FA check

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

// Nextjs Middleware allows us to run code before a request is completed.
// It gives us more control with how we handle the logistics of dataflow
// within our application as well as more control regarding security, 
// improvement on performance and potentially better user experience 
// when making requests within our application

// NextJS middlware by default is edge runtime/ serverless  (i.e. Azure Functions, AWS Lambda)
// and are Deployed on a CDN (Content Delivery Network) to handle certain
// geographical requests -> But our ORM (PRISMA) is not compatible on that runtime(Edge)
// So we need to use the JWT (JSON WEB TOKEN) to authenticate our users
// Resulting in PRISMA not attempting to connect to our DB