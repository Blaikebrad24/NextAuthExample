"use server";
import * as z from "zod";
import { RegisterSchema } from "@/schemas";


export const register = async (values : z.infer<typeof RegisterSchema>) => {
    console.log(values)
    //validate fields
    // client side validation can always be bypassed

    const validatedFields = RegisterSchema.safeParse(values); // on the server where nobody can manipulate

    if(!validatedFields.success)
        {
            return {error : "Invalid fields!"};
        }
    
    return { success : "Email sent"}
}