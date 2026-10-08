import { Place as prismaPlace } from '../../generated/prisma/client';

export type placeAndLanguage = Place & {
  Languages: { name: string; id: number }[];
};

export type Place = prismaPlace;
