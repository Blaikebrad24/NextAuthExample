"use server";
import * as z from "zod";
import { RegisterSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { prismaDB } from "@/lib/db";
import { hash } from "crypto";
import { generateVerificationToken } from "@/lib/tokens";


export const register = async (values : z.infer<typeof RegisterSchema>) => {
    console.log(values)
    //validate fields
    // client side validation can always be bypassed

    const validatedFields = RegisterSchema.safeParse(values); // on the server where nobody can manipulate

    if(!validatedFields.success)
    {
        return {error : "Invalid fields!"};
    }
    const { email, password, name } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password,10);
    
    //confirm email is not already used 
    const existingUser = await prismaDB.user.findUnique({where:{email}});
    if(existingUser){return {error: "Email already in use!"}};

    await prismaDB.user.create({ data:{name,email, password: hashedPassword}});
    const verificationToken = await generateVerificationToken(email)
    // do not allow user to sign in if they have not verified by email
    //update user on the login form
    return { success : "Confirmation email sent"}
}