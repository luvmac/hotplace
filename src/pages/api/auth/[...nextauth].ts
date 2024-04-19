import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import GoogleProvider from "next-auth/providers/google";
import NaverProvider from "next-auth/providers/naver"
import { getMaxAge } from "next/dist/server/image-optimizer";


const prisma = new PrismaClient();



export const authOptions: any = {
  session : {
    strategy: "jwt" as const,
    maxAge: 60 * 60 & 24,
    updateAge: 60 * 60 & 2,
  },
  adapter: PrismaAdapter(prisma),
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID|| "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID || "",
      clientSecret: process.env.NAVER_CLIENT_SECRET || ""
    })
  ],
  pages: {
    signIn: "/users/login"
  },
};

export default NextAuth(authOptions);