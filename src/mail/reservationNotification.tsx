import type { reservationNotification } from '../types/email';
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Row,
  Section,
  Tailwind,
  Text,
  Preview,
  Button,
} from 'react-email';

export function ReservationNotification({
  data,
}: {
  data: reservationNotification;
}) {
  const formatPrice = (cents: number) => `${(cents / 100).toFixed(2)} CHF`;
  const _formatDate = (d: Date) =>
    d.toLocaleDateString('fr-CH', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

  return (
    <Html>
      <Head />
      <Preview>"sss"</Preview>
      <Tailwind>
        <Body className="bg-black m-auto font-sans">
          <Container className="mb-10 mx-auto p-5 max-w-[465px]">
            <Section className="mt-10"></Section>
            <Heading className="text-2xl text-white font-normal text-center p-0 my-8 mx-0">
              Welcome to <strong>Something</strong>, username!
            </Heading>
            <Text className="text-start text-sm text-white">
              Hello username,
            </Text>
            <Text className="text-start text-sm text-white leading-relaxed">
              We're excited to have you onboard at <strong>company</strong>. We
              hope you enjoy your journey with us. If you have any questions or
              need assistance, feel free to reach out.
            </Text>
            <Section className="text-center mt-[32px] mb-[32px]">
              <Button
                className="py-2.5 px-5 bg-white rounded-md text-black text-sm font-semibold no-underline text-center"
                href={`https://example.com/get-started`}
              >
                Get Started
              </Button>
            </Section>
            <Text className="text-start text-sm text-white">
              Cheers,
              <br />
              The Team
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
