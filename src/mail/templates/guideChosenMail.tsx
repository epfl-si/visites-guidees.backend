import {
  Body,
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
import { guideChosen } from '../interfaces/guideChosen.interface';

const colors = {
  red: '#FF0000',
  black: '#1A1A1A',
  text: '#333333',
  muted: '#767676',
  border: '#E5E5E5',
  white: '#FFFFFF',
};

export function GuideChosenEmail({ data }: { data: guideChosen }) {
  const details = [
    { label: 'La langue de la visite : ', content: data.language },
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
    {
      label: 'Nombre de participantes et participants : ',
      content: String(data.participantsNumber),
    },
    {
      label: 'Nombre de guides : ',
      content: String(data.numberOfGuide),
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
          Vous animerez une visite guidée EPFL - voici les détails.
        </Preview>
        <Body style={main}>
          <Container style={container}>
            <Section>
              <Img
                alt="EPFL"
                width={110}
                height={32}
                src="https://epfl-si.github.io/elements/svg/epfl-logo.svg"
                style={{ display: 'inline-block' }}
              />
            </Section>

            <Heading style={title}>Vous animerez cette visite guidée</Heading>

            <Text style={paragraph}>
              Bonjour {data.guide.name} {data.guide.lastName},
            </Text>
            <Text style={paragraph}>
              Vous avez été retenu pour la visite de {data.place}. Merci d'avoir
              accepté.
            </Text>

            <Section>
              {details.map((detail) => (
                <Row key={detail.label}>
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

            <Hr style={{ borderColor: colors.border, marginTop: '20px' }} />
            <Text style={note}>
              En cas d'empêchement, merci de prévenir au plus vite :{' '}
              <Link style={{ color: colors.text }}>
                visites-guidees@epfl.ch
              </Link>{' '}
            </Text>

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

const main = {
  backgroundColor: colors.white,
  fontFamily: 'Arial, Helvetica, sans-serif',
  boxSizing: 'border-box' as const,
};

const container = {
  maxWidth: '680px',
  margin: '0 auto',
  padding: '0px',
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
