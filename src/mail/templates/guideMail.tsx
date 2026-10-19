import {
  Button,
  Column,
  Heading,
  Row,
  Section,
  Text,
} from '@react-email/components';
import { guideNotification } from '../interfaces/guideNotification.interface';
import { MailLayout } from './mailLayout';

export function VisitGuideEmail({ data }: { data: guideNotification }) {
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
  const preview =
    'Proposition de visite guidée EPFL - merci de confirmer votre disponibilité.';

  return (
    <MailLayout preview={preview}>
      <Heading className="text-xl font-bold text-black mb-4 mt-4">
        Proposition de visite guidée
      </Heading>
      <Text className="text-base/4 text-black mb-4">
        Bonjour {data.guide.name} {data.guide.lastName},
      </Text>
      <Text className="text-base/4 text-black mb-4">
        Nous avons reçu une demande de visite pour {data.place}
      </Text>
      <Section>
        {details.map((detail, id) => (
          <Row key={id}>
            <Column width="8" valign="top" className="pr-[6px]">
              <Text className="m-0 text-black text-[14px] leading-[16px]">
                •
              </Text>
            </Column>
            <Column className="align-top">
              <Text className="m-0 text-gray-500 text-[14px] leading-[16px]">
                {detail.label} <strong>{detail.content}</strong>
              </Text>
            </Column>
          </Row>
        ))}
      </Section>
      <Section className="mt-6 mb-2">
        <Row>
          <Button
            href={data.url}
            className="inline-block px-6 py-2 text-sm font-bold text-center bg-red-600 text-white"
          >
            Accéder à la demande
          </Button>
        </Row>
      </Section>
    </MailLayout>
  );
}
