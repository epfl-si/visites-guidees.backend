import { Place } from '@/types/place';
import { ConfirmationAfterForm } from './confirmationAfterForm';
import { Reservation } from '@/types/reservation';

export default function Preview() {
  const place: Place = {
    id: 1,
    price: 120,
    title: {
      en: 'EPFL Campus (Standard)',
      fr: 'Campus EPFL (Standard)',
    },
    capacity: 10,
    conditions: {
      en: 'Good shoes recommended',
      fr: 'Bonnes chaussures recommandées',
    },
    createdAt: new Date(),
    description: {
      en: 'General guided tour of the campus',
      fr: 'Visite guidée générale du campus',
    },
    picture: 'picture',
    updatedAt: new Date(),
  };
  const reservation: Reservation = {
    address: 'address',
    firstName: 'Antoine',
    lastName: 'Fabre',
    participantNumber: 10,
    city: 'Lausanne',
    country: 'Swiss',
    date: new Date(),
    email: 'antoine.fabre@epfl.ch',
    id: 1,
    languageId: 1,
    payment: 'Carte',
    phone: '+41XXXXXXXXXXXX',
    placeId: 1,
    region: 'Vaud',
    status: 'WAITINGGUIDE',
    createdAt: new Date(),
    updatedAt: new Date(),
    zip: '1000',
    additionalAddress: null,
    comment: null,
    company: null,
  };

  return <ConfirmationAfterForm place={place} reservation={reservation} />;
}
