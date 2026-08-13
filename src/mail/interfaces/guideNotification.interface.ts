export interface guideNotification {
  guide: {
    name: string,
    lastName: string
  };
  place: string;
  date: Date;
  numberOfGuide: number,
  language: string,
  participantsCount: number,
  url: string
}