import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/app/libs/prismadb";

//func get current user without calling api
//(not a route, this is a direct communication from server component to database)
export default async function getCurrenUser() {
  try {
    //get data of user logging
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return null;
    }

    //find user whose email is equal to session.user.email
    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
    });

    //not matched
    if (!currentUser) {
      return null;
    }

    return currentUser || null;
  } catch (error: any) {
    return null;
  }
}
