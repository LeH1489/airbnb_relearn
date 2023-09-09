import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  const bodyFromRequest = await request.json();

  const { totalPrice, startDate, endDate, listingId } = bodyFromRequest;

  //if data is invalid
  if (!listingId || !startDate || !endDate || !totalPrice) {
    return NextResponse.error();
  }

  //create a reservation
  //create: automatically link our relation between listing and reservation
  const listingAndReservation = await prisma.listing.update({
    where: {
      id: listingId,
    },
    data: {
      reservations: {
        create: {
          userId: currentUser.id,
          startDate,
          endDate,
          totalPrice,
        },
      },
    },
  });
  return NextResponse.json(listingAndReservation);
}
