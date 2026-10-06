import { guideChosen } from '../interfaces/guideChosen.interface';
import { GuideChosenEmail } from './guideChosenMail';

export default function Preview() {
  const data: guideChosen = {
    guide: { name: 'Jean', lastName: 'Dupont' },
    date: new Date('2026-09-15T10:00:00'),
    place: 'Visite du Rolex Learning Center',
    language: 'Français',
    participantsNumber: 21,
    numberOfGuide: 2,
  };
  return <GuideChosenEmail data={data} />;
}
