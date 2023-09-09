import getCurrenUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservations";
import EmptyState from "../components/EmptyState";
import TripClient from "./TripClient";

const TripPage = async () => {
  const currentUser = await getCurrenUser();

  if (!currentUser) {
    return <EmptyState title="Authorized" subtitle="Please login!" />;
  }

  //all of trips which user have
  const reservations = await getReservations({ userId: currentUser.id });

  if (reservations.length === 0) {
    return (
      <EmptyState
        title="No trips found"
        subtitle="Look like you haven't reserved any trips!"
      />
    );
  }

  return <TripClient reservations={reservations} currentUser={currentUser} />;
};

export default TripPage;
