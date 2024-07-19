import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

async function main()
{
    const allUsers = await prisma.user.findMany();
    const allAccounts = await prisma.account.findMany()


    console.log(allUsers);
    console.log("--------")
    console.log(allAccounts);
     
}

main()