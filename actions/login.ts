"use server";
import * as z from "zod";
import { LoginSchema } from "@/schemas";


export const login = async (values : z.infer<typeof LoginSchema>) => {
    console.log(values)
    //validate fields
    // client side validation can always be bypassed

    const validatedFields = LoginSchema.safeParse(values); // on the server where nobody can manipulate

    if(!validatedFields.success)
        {
            return {error : "Invalid fields!"};
        }
    
    return { success : "Email sent"}
}