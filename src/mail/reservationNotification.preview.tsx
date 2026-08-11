import { ReservationNotification } from './reservationNotification';

export default function Preview() {
  return (
    <ReservationNotification
      data={{
        guideFirstName: 'Anna',
        guideLastName: 'Fontcuberta',
        visitorFirstName: 'Guy ',
        visitorLastName: 'Parmelin',
        place: 'Rolex Learning Center',
        date: 1815825600000,
        numberOfParticipant: 22,
        numberOfNeededGuide: 2,
      }}
    />
  );
}
