import type { UserType } from "@prisma/client";
import type { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id: string;
      email: string;
      image: string | null,
      name: string | null,
      user_type: UserType
    } & DefaultSession["user"];
  }
  interface User extends DefaultUser {
    user_type: UserType
  }
}
