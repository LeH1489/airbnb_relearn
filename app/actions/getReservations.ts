import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId?: string;
  userId?: string; //for my trips page
  authorId?: string; //for reservation
}

export default async function getReservations(params: IParams) {
  try {
    const { listingId, userId, authorId } = params;

    const query: any = {};

    //depending on Whether client send listingId or userId or authorId ==> query by different thing

    //if send listingId ==> find all reservation for the single which user's looking at
    if (listingId) {
      query.listingId = listingId;
    }

    //if send userId ==> find all of trips which user have
    if (userId) {
      query.userId = userId;
    }

    //if send authorId ==> find all of reservation that other user create listing
    if (authorId) {
      query.listing = { userId: authorId };
    }

    //get reservation depending on query
    const reservation = await prisma.reservation.findMany({
      where: query,
      include: {
        listing: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return reservation;
  } catch (error: any) {
    throw new Error(error);
  }
}
