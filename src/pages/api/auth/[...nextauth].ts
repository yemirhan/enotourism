import { PrismaAdapter } from '@next-auth/prisma-adapter';
import NextAuth, { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";
import { ILogin, loginSchema } from "@/validation/auth";
import { User } from '@prisma/client';


export const authOptions: NextAuthOptions = {
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.user_type = (user as User).user_type;
      }

      return token;
    },
    async session({ session, token, user }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.user_type = (token as any)?.user_type;

      }

      return session;
    },
  },
  session: {
    strategy: 'jwt',

  },
  secret: env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    newUser: "/register",
    error: "/login",
  },
  theme: {
    logo: "/glass-full.svg",
    colorScheme: "dark",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      type: 'credentials',
      id: 'credentials',
      async authorize(credentials, req) {
        const cred: ILogin = await loginSchema.parseAsync(credentials);

        const user = await prisma.user.findFirst({
          where: { email: cred.email },
        });

        if (!user) {
          return null;
        }

        const isValidPassword = bcrypt.compareSync(
          cred.password,
          user.password
        );

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          image: user.photo,
          name: user.name,
          user_type: user.user_type,
        };
      },
    }),
    // ...add more providers here
  ],
};

export default NextAuth(authOptions);
