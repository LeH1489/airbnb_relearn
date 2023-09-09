import getCurrenUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservations";
import EmptyState from "../components/EmptyState";
import ReservationClient from "./ReservationClient";

const ReservaionpPage = async () => {
  const currentUser = await getCurrenUser();

  if (!currentUser) {
    return <EmptyState title="Unauthorized" subtitle="Please login!" />;
  }

  //find reservations for creator (listing owner)
  //xem có ai đặt phòng chưa
  const reservations = await getReservations({ authorId: currentUser.id });

  if (reservations.length === 0) {
    return (
      <EmptyState
        title="No reservation found"
        subtitle="Looks like you have no reservationss on your properties!"
      />
    );
  }

  return (
    <ReservationClient reservations={reservations} currentUser={currentUser} />
  );
};

export default ReservaionpPage;
