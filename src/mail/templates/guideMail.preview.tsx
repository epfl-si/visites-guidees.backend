import { guideNotification } from '../interfaces/guideNotification.interface';
import VisitGuideeEmail from './guideMail';

export default function Preview() {
  const data: guideNotification = {
    guide: { name: 'Jean', lastName: 'Dupont' },
    date: new Date('2026-09-15T10:00:00'),
    place: 'Visite du rolex',
    language: 'Français',
    numberOfGuide: 2,
    participantsCount: 21,
    url: 'http://localhost:5173/something',
  };
  return <VisitGuideeEmail data={data} />;
}
