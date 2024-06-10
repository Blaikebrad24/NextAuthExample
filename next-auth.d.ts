import { UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";


// add custom fields here to attach to the session token
// user specific data
export type ExtendedUser = DefaultSession["user"] & {
    role: UserRole
    // customField: string
};

declare module "next-auth" {
    interface Session {
        user: ExtendedUser;
    }
}