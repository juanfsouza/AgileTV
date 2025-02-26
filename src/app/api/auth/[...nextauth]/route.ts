import prisma from "@/src/app/prisma/prisma";
import { PrismaClient, Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials?.email && credentials.password) {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (user && user.password === credentials.password) {
            return user;
          }
        }
        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };
    function PrismaAdapter(prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>): import("next-auth/adapters").Adapter | undefined {
        throw new Error("Function not implemented.");
    }

