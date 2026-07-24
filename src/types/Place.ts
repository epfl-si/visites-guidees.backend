import { places } from "../../generated/prisma/client";
export type placeAndLanguage = places & {
    Languages: string[];
};