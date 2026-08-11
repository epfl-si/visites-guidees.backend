import { Place } from '../../generated/prisma/client';

export type placeAndLanguage = Place & {
  Languages: { name: string; id: number }[];
};
