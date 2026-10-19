import {
  Body,
  Container,
  Font,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Img,
  Tailwind,
} from '@react-email/components';
import React from 'react';

export function MailLayout({
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
        <Body className="bg-slate-100 font-sans">
          <Container className="max-w-170 m-auto bg-white rounded-lg overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)] ">
            <Section className="bg-white pt-4 pb-6 px-8">
              <Img
                alt="EPFL"
                width={110}
                height={32}
                src="https://epfl-si.github.io/elements/svg/epfl-logo.svg"
                className="inline-block ml-5"
              />
            </Section>
            <Container className="px-3 mb-4">{children}</Container>
            <Container className="bg-gray-50 pl-4">
              <Text className="text-xs/4 text-zinc-400">
                Mediacom - École polytechnique fédérale de Lausanne
                <br />
                EPFL P-MEDIACOM, CM 2 360, Station 10, CH-1015 Lausanne
              </Text>
            </Container>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}
