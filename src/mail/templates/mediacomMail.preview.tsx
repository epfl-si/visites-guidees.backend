import { mediacomValidation } from '../interfaces/mediacomValidation.interface';
import MediacomValidationMail from './mediacomMail';

export default function Preview() {
  const data: mediacomValidation = {
    guide: [{ name: 'Jean', lastName: 'Dupont', sciper: '1111111' }],
    date: new Date('2026-09-15T10:00:00'),
    place: 'Visite du rolex',
    language: 'Français',
    numberOfGuide: 2,
    participantsCount: 21,
    url: 'http://localhost:5173/something',
  };
  return <MediacomValidationMail data={data} />;
}
