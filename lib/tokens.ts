import { promisify } from "util";
import { v4 as uuidv4 } from "uuid";
import { prismaDB } from "./db";
import { getVerificationTokenByEmail } from "@/data/verificationtoken";


export const generateVerificationToken = async (email: string) => {

    // generate unique token
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000); // expires in 1 hour

    // check existing token for this email
    const existingToken = await getVerificationTokenByEmail(email);
    if(existingToken){
        await prismaDB.verificationToken.delete({
            where: {
                id: existingToken.id,
            }
        })
    }

    const verificationToken = await prismaDB.verificationToken.create({
        data: {
            email,
            token,
            expires,
        }
    })

    return verificationToken;
}