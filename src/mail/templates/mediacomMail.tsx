import {
  Body,
  Button,
  Container,
  Column,
  Font,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Img,
  Tailwind,
} from '@react-email/components';
import { mediacomValidation } from '../interfaces/mediacomValidation.interface';

const colors = {
  red: '#FF0000',
  black: '#1A1A1A',
  text: '#333333',
  muted: '#767676',
  border: '#E5E5E5',
  borderStrong: '#CCCCCC',
  white: '#FFFFFF',
};

const textStyle = {
  fontFamily: 'Arial, sans-serif',
  fontSize: '14px',
  color: '#333333',
};

export default function mediacomValidationMail({
  data,
}: {
  data: mediacomValidation;
}) {
  const details = [
    { label: 'La langue souhaitée : ', content: data.language },
    {
      label: 'Date de la visite : ',
      content: data.date.toLocaleDateString('fr-FR'),
    },
    {
      label: 'Heure de la visite : ',
      content: data.date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
  ];
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
          Demande de validation - merci de valider la configuration.
        </Preview>
        <Body style={main}>
          <Container style={container}>
            {/* Wordmark */}
            <Section>
              <Img
                alt="EPFL"
                width={110}
                height={32}
                src="https://epfl-si.github.io/elements/svg/epfl-logo.svg"
                style={{ display: 'inline-block' }}
              />
            </Section>

            {/* Titre */}
            <Heading style={title}>Proposition de visite guidée</Heading>

            <Text style={paragraph}>Bonjour,</Text>
            <Text style={paragraph}>
              Vous avez reçu une demande de visite pour {data.place}
            </Text>

            <Section style={{ marginBottom: '10px' }}>
              {details.map((detail) => (
                <Row>
                  <Column width="8" valign="top" className="pr-[6px]">
                    <Text className="m-0 text-black text-[14px] leading-[16px]">
                      •
                    </Text>
                  </Column>
                  <Column valign="top">
                    <Text className="m-0 text-gray-500 text-[14px] leading-[16px]">
                      {detail.label} <strong>{detail.content}</strong>
                    </Text>
                  </Column>
                </Row>
              ))}
            </Section>

            {/*  Guides*/}
            <Section>
              <Text style={paragraph}>
                {data.guide.length > 1
                  ? 'Les guides selectionnées sont : '
                  : 'Le guide selectionné est :'}
              </Text>
              {data.guide.map((guide) => (
                <Row>
                  <Column width="8" valign="top" className="pr-[6px]">
                    <Text className="m-0 text-black text-[14px] leading-[16px]">
                      •
                    </Text>
                  </Column>
                  <Column valign="top">
                    <Text className="m-0 text-gray-500 text-[14px] leading-[16px]">
                      {guide.name} {guide.lastName}
                    </Text>
                  </Column>
                </Row>
              ))}
            </Section>

            <Section style={{ marginTop: '24px', marginBottom: '8px' }}>
              <Row>
                <Button style={buttonBase} href={data.url}>
                  Accéder à la demande
                </Button>
              </Row>
            </Section>

            <Hr style={{ borderColor: colors.border, marginTop: '20px' }} />

            {/* Footer */}
            <Text style={footer}>
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

// ---- Styles ----

const main = {
  backgroundColor: colors.white,
  fontFamily: "'Inter', Arial, Helvetica, sans-serif",
  padding: '40px',
  boxSizing: 'border-box' as const,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
};

const container = {
  maxWidth: '680px',
  margin: '0 auto',
  padding: '0 32px',
};

const wordmark = {
  fontSize: '32px',
  fontWeight: 700,
  color: colors.black,
  letterSpacing: '0.5px',
  margin: 0,
};

const title = {
  fontSize: '19px',
  fontWeight: 700,
  color: colors.black,
  margin: '24px 0 4px 0',
};

const paragraph = {
  fontSize: '15px',
  lineHeight: '22px',
  color: colors.text,
  margin: '0 0 16px 0',
};

const detailLabel = {
  width: '150px',
  padding: '10px 0',
  fontSize: '14px',
  color: colors.muted,
  verticalAlign: 'top',
};

const detailValue = {
  padding: '10px 0',
  fontSize: '14px',
  color: colors.black,
  verticalAlign: 'top',
};

const buttonBase = {
  display: 'inline-block',
  padding: '11px 26px',
  fontSize: '14px',
  fontWeight: 700,
  textDecoration: 'none',
  textAlign: 'center' as const,
  backgroundColor: colors.red,
  color: colors.white,
};

const note = {
  fontSize: '13px',
  lineHeight: '20px',
  color: colors.muted,
  marginTop: '16px',
};

const footer = {
  fontSize: '12px',
  lineHeight: '18px',
  color: '#999999',
  marginTop: '8px',
  marginBottom: '32px',
};
