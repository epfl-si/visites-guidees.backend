import {
  Body,
  Container,
  Font,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Img,
  Tailwind,
} from '@react-email/components';
import React from 'react';

export function MailTemplate({
  children,
  preview,
}: {
  children: React.ReactNode;
  preview: string;
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
        <Preview>{preview}</Preview>
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
            {children}
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
