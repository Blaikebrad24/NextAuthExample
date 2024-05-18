import { PrismaClient } from "@prisma/client";

// After every file save NextJS runs a hot reload that the reinitializes a new Prisma Client
// if NODE_ENV is not in production, store the prisma client in globalThis.prisma
// global is outside of hot reload scope
// it will create new Prisma client connection on the first run or in production ONLY
// stopped at 1:55 Next Auth V5

declare global {
    var prisma: PrismaClient | undefined
}

export const prismaDB = globalThis.prisma || new PrismaClient(); 

if (process.env.NODE_ENV !== "production") globalThis.prisma = prismaDB;