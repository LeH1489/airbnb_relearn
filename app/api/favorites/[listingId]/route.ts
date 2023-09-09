import prisma from "@/app/libs/prismadb";
import { NextResponse } from "next/server";
import getCurrenUser from "@/app/actions/getCurrentUser";

interface IParams {
  listingId?: string;
}

//api handler (fetch data via route handler)
export async function POST(request: Request, { params }: { params: IParams }) {
  const currentUser = await getCurrenUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  //get id of listing from url
  const { listingId } = params;

  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid ListingId!");
  }

  //get FavoritesIds array field of current user
  let favoriteIdsUpdated = [...(currentUser.favoriteIds || [])];
  ////push id of the listing (from url) to favoriteIDs field of current user
  favoriteIdsUpdated.push(listingId);

  const userUpdated = await prisma.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      favoriteIds: favoriteIdsUpdated,
    },
  });

  return NextResponse.json(userUpdated);
}

export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrenUser();

  if (!currentUser) {
    return NextResponse.error();
  }

  //get id of listing from url
  const { listingId } = params;

  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid ListingId!");
  }

  //get FavoritesIds array field of current user
  let favoriteIdsUpdated = [...(currentUser.favoriteIds || [])];

  //return true ==> elements is included in array, return false ==> elements is eliminated from array
  favoriteIdsUpdated = favoriteIdsUpdated.filter((id) => id !== listingId);

  const userUpdated = await prisma.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      favoriteIds: favoriteIdsUpdated,
    },
  });

  return NextResponse.json(userUpdated);
}
