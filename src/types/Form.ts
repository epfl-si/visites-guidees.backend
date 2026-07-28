export interface form {
    placeId: number;
    firstName: string;
    lastName: string;
    company?: string;
    email: string;
    phone: string;
    address: string;
    additionnalAddress?: string;
    city: string;
    region: string;
    zip: number;
    country: string;
    visitDate: number | Date; // reste tel quel : c'est ce que le front envoie
    numberOfParticipant: number;
    languageId: number;
    comments?: string;
    gdprConsent: boolean;
}
export type ReservationCreateData = Omit<form, "gdprConsent" | "visitDate"> & {
    visitDate: Date;
};