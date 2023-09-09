import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

//api handler (fetch data via route handler)
export async function POST(request: Request) {
  //get data from request body
  const bodyFromRequest = await request.json();

  //destructering data from body request
  const { email, name, password } = bodyFromRequest;

  //hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword,
    },
  });

  return NextResponse.json(newUser);
}
