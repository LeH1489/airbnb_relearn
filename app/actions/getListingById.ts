import prisma from "@/app/libs/prismadb";

interface IParams {
  listingId?: string;
}

//func get current user without calling api
//(not a route, this is a direct communication from server component to database)
export default async function getListingById(params: IParams) {
  try {
    const { listingId } = params;

    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId,
      },
      include: {
        user: true,
      },
    });

    if (!listing) {
      return null;
    }

    return listing;
  } catch (error: any) {
    throw new Error(error);
  }
}
