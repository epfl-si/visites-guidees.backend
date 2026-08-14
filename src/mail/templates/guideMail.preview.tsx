import { guideNotification } from '../interfaces/guideNotification.interface';
import { VisitGuideEmail } from './guideMail';

export default function Preview() {
  const data: guideNotification = {
    guide: { name: 'Jean', lastName: 'Dupont' },
    date: new Date('2026-09-15T10:00:00'),
    place: 'Visite du rolex',
    language: 'Français',
    numberOfGuide: 2,
    participantsNumber: 21,
    url: 'http://localhost:5173/something',
  };
  return <VisitGuideEmail data={data} />;
}
