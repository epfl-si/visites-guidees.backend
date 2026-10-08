import { Reservation } from '@/types/reservation';
import {
  Body,
  Container,
  Font,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Img,
  Tailwind,
} from '@react-email/components';
import { Place } from '@/types/place';

export function ConfirmationAfterForm({
  reservation,
  place,
}: {
  reservation: Reservation;
  place: Place;
}) {
  return (
    <Tailwind>
      <Html lang="fr">
        <Head>
          <Font
            fontFamily="Arial"
            fallbackFontFamily="Helvetica"
            fontWeight={400}
            fontStyle="normal"
          />
        </Head>
        <Preview>
          Réservation de visite guidée EPFL - Nous avons bien reçu votre
          demande.
        </Preview>
        <Body className="bg-white font-sans box-border">
          <Container className="max-w-170 m-auto">
            <Section>
              <Img
                alt="EPFL"
                width={110}
                height={32}
                src="https://epfl-si.github.io/elements/svg/epfl-logo.svg"
                className="inline-block"
              />
            </Section>

            <Heading className="text-xl font-bold text-black mb-4 mt-4">
              Réservation de visite guidée
            </Heading>

            <Text>
              Bonjour {reservation.firstName} {reservation.lastName}, <br />
              Nous avons bien reçu votre demande de réservation pour{' '}
              {place.title?.fr} <br />
              nous traiterons votre demande dans les plus brefs délais.
            </Text>
            <Hr className="border-zinc-200 mt-10" />
            <Text className="text-xs/4 text-zinc-400">
              Mediacom - École polytechnique fédérale de Lausanne (EPFL)
              <br />
              EPFL P-MEDIACOM, CM 2 360 (Centre Midi), Station 10, CH-1015
              Lausanne
            </Text>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}
