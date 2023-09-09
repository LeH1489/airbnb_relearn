import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId?: string;
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== "string") {
    return new Error("Invalid ID!");
  }

  //using deleteMany for multiple query (where)
  const listingDeleted = await prisma.listing.deleteMany({
    where: {
      id: listingId,
      userId: currentUser.id, //owner of the listing
    },
  });
  return NextResponse.json(listingDeleted);
}
