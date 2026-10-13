import {
  Column,
  Heading,
  Hr,
  Link,
  Row,
  Section,
  Text,
} from '@react-email/components';
import { guideChosen } from '../interfaces/guideChosen.interface';
import { MailTemplate } from './mail-template';

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
  const preview = 'Vous animerez une visite guidée EPFL - voici les détails.';

  return (
    <MailTemplate preview={preview}>
      <Heading className="text-xl font-bold text-black mb-4 mt-4">
        Vous animerez cette visite guidée
      </Heading>
      <Text className="text-base/4 text-black mb-4">
        Bonjour {data.guide.name} {data.guide.lastName},
      </Text>
      <Text className="text-base/4 text-black mb-4">
        Vous avez été retenu pour la visite de {data.place}. Merci d&apos;avoir
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
      <Hr className="my-4 border-gray-300" />
      <Text className="text-sm/5 text-gray-500">
        En cas d&apos;empêchement, merci de prévenir au plus vite :{' '}
        <Link
          href="mailto:visites-guidees@epfl.ch"
          className="text-gray-700 underline"
        >
          visites-guidees@epfl.ch
        </Link>
      </Text>
    </MailTemplate>
  );
}
