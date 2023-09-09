import getCurrenUser from "../actions/getCurrentUser";
import getFavoriteListings from "../actions/getFavoriteListings";
import EmptyState from "../components/EmptyState";
import FavoriteListingClient from "./FavoriteListingClient";

const FavoritePage = async () => {
  const currentUser = await getCurrenUser();
  const favoriteListing = await getFavoriteListings();

  if (favoriteListing.length === 0) {
    return (
      <EmptyState
        title="No favorites found"
        subtitle="Looks like you have no favorite listings!"
      />
    );
  }

  return (
    <FavoriteListingClient
      listings={favoriteListing}
      currentUser={currentUser}
    />
  );
};

export default FavoritePage;
