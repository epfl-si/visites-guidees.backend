import { Reservation } from '@/types/reservation';
import { Column, Heading, Text, Row, Hr } from '@react-email/components';
import { Place } from '@/types/place';
import { MailLayout } from './mailLayout';

export function ConfirmationAfterForm({
  reservation,
  place,
}: {
  reservation: Reservation;
  place: Place;
}) {
  const preview =
    'Réservation de visite guidée EPFL - Nous avons bien reçu votre demande.';

  return (
    <MailLayout preview={preview}>
      <Heading className="text-xl font-bold text-black mb-4 mt-4">
        Réservation de visite guidée
      </Heading>
      <Text className="text-base mb-8">
        Bonjour {reservation.firstName} {reservation.lastName}, <br />
        Nous avons bien reçu votre demande de réservation pour :
      </Text>
      <Row>
        <Column className="w-1/3 text-left">Visite</Column>
        <Column className="w-1/3 text-center">Nombre de personnes</Column>
        <Column className="w-1/3 text-right">Date</Column>
      </Row>
      <Hr className="my-4 border-gray-300" />
      <Row>
        <Column className="w-1/3 text-left">
          {(place.title as { fr?: string } | null)?.fr}
        </Column>
        <Column className="w-1/3 text-center">
          {reservation.participantNumber}
        </Column>
        <Column className="w-1/3 text-right">
          {reservation.date.toDateString()}
        </Column>
      </Row>
      <Hr className="my-4 border-gray-300" />
      <Text className="text-base">
        Nous traiterons votre demande dans les plus brefs délais.
      </Text>
      <Text>L'équipe des visites guidées</Text>
    </MailLayout>
  );
}
