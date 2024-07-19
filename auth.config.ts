import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import bcrypt from "bcryptjs";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

/*
Credentials - this provider is used to setup external authentication within the app (i.e. github/google credentials of user)
The provider sends the credentials to the auth service via authorize callback

*/
export default { 
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Github({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
        Credentials({
            async authorize(credentials){
                // validate fields again based on schema
                const validatedFields = LoginSchema.safeParse(credentials);
                
                if(validatedFields.success)
                    {
                        console.log("Fields are validated --->")
                        const { email, password } = validatedFields.data;
                        // check pw to user
                        const user = await getUserByEmail(email);
                        if(!user || !user.password) return null; // user could not have a pw if signed with Github or other providers
                        
                        // compare hashPw and PW
                        const passwordMatch = await bcrypt.compare(password, user.password);

                        if(passwordMatch) return user;
                    }
                    return null;
            }
        })
] } satisfies NextAuthConfig


// this will trigger NextJS Middleware instead of auth.ts