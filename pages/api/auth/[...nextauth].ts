import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { AuthOptions } from "next-auth";
import prisma from "@/app/libs/prismadb";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import NextAuth from "next-auth";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        //if user's missing the credentials
        if (!credentials?.email || !credentials.password) {
          throw new Error("Invalid credentials");
        }

        //find user by email
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        //if user's not found or doesn't have a hashedPassword
        if (!user || !user.hashedPassword) {
          throw new Error("User not found!");
        }

        //compare the password input with the user's hashedPassword in databas
        const isPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isPassword) {
          throw new Error("Invalid credential");
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
