import { Reservation } from '@/types/reservation';
import { Heading, Text } from '@react-email/components';
import { Place } from '@/types/place';
import { MailTemplate } from './mail-template';

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
    <MailTemplate preview={preview}>
      <Heading className="text-xl font-bold text-black mb-4 mt-4">
        Réservation de visite guidée
      </Heading>
      <Text>
        Bonjour {reservation.firstName} {reservation.lastName}, <br />
        Nous avons bien reçu votre demande de réservation pour{' '}
        {(place.title as { fr?: string } | null)?.fr} <br />
        nous traiterons votre demande dans les plus brefs délais.
      </Text>
    </MailTemplate>
  );
}
