export const includeReservation = {
  reservationGuides: {
    include: {
      guide: {
        include: {
          user: true,
        },
      },
    },
  },
  language: true,
  place: true,
};
