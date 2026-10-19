import {
  Button,
  Column,
  Heading,
  Row,
  Section,
  Text,
} from '@react-email/components';
import { mediacomValidation } from '../interfaces/mediacomValidation.interface';
import { MailLayout } from './mailLayout';

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
  const preview = 'Demande de validation - merci de valider la configuration.';
  return (
    <MailLayout preview={preview}>
      <Heading className="text-xl font-bold text-black mb-2 mt-4">
        Proposition de visite guidée
      </Heading>

      <Text className="text-sm/4 text-black mb-4">Bonjour,</Text>
      <Text className="text-sm/4 text-black mb-4">
        Vous avez reçu une demande de visite pour {data.place}
      </Text>

      <Section className="mb-3">
        {details.map((detail, id) => (
          <Row key={id}>
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

      <Section>
        <Text className="text-sm/4 text-black mb-4">
          {data.guide.length > 1
            ? 'Les guides selectionnées sont : '
            : 'Le guide selectionné est :'}
        </Text>
        {data.guide.map((guide, id) => (
          <Row key={id}>
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
