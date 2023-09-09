import getCurrenUser from "../actions/getCurrentUser";
import getListings from "../actions/getListings";
import getReservations from "../actions/getReservations";
import EmptyState from "../components/EmptyState";
import PropertiesClient from "./PropertiesClient";
import TripClient from "./PropertiesClient";

const PropertiesPage = async () => {
  const currentUser = await getCurrenUser();

  if (!currentUser) {
    return <EmptyState title="Authorized" subtitle="Please login!" />;
  }

  //all of trips which user have
  const listings = await getListings({ userId: currentUser.id });

  if (listings.length === 0) {
    return (
      <EmptyState
        title="No properties found"
        subtitle="Look like you have no properties!"
      />
    );
  }

  return <PropertiesClient listings={listings} currentUser={currentUser} />;
};

export default PropertiesPage;
