import NextAuth, { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";
import { ILogin, loginSchema } from "@/validation/auth";


export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }

      return token;
    },
    session({ session, token, user }) {
      if (token && session.user) {
        session.user.id = parseInt(token.id as string);


      }
      console.log(user);
      return session;
    },
  },
  secret: env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    newUser: "/register",
    error: "/login",
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
          id: (user.id).toString(),
          email: user.email,
          image: user.photo,
          name: user.name,

        };
      },
    }),
    // ...add more providers here
  ],
};

export default NextAuth(authOptions);
