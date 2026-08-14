// ============================================
// READ BEFORE SEEDING
// ============================================
const your_email_user = '' // your email adress exmaple : bob.dupont
const domain = 'epfl.ch'

import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL ?? '',
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // ============================================
  // CLEANUP (reverse dependency order)
  // Les tables de jointure implicites (Guide<->Language,
  // Place<->Language, BlockedPeriod<->Place, BlockedPeriod<->Guide)
  // sont nettoyées automatiquement par Prisma quand on supprime
  // les enregistrements des tables principales.
  // ============================================
  await prisma.reservationGuide.deleteMany();
  await prisma.reservation.deleteMany();
  await prisma.guide.deleteMany();
  await prisma.blockedPeriod.deleteMany();
  await prisma.user.deleteMany();
  await prisma.place.deleteMany();
  await prisma.language.deleteMany();

  // ============================================
  // LANGUAGES
  // Pas d'id explicite : Language.id est autoincrement, on récupère
  // les ids générés et on les référence ensuite par leur code.
  // ============================================
  const languagesData = [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'es', name: 'Español' },
    { code: 'pt', name: 'Português' },
  ];
  await prisma.language.createMany({ data: languagesData });

  const languages = await prisma.language.findMany();
  const languageIdByCode: Record<string, number> = Object.fromEntries(
    languages.map((language) => [language.code, language.id]),
  );

  // ============================================
  // PLACES
  // Pas d'id explicite : Place.id est autoincrement. On utilise une
  // clé locale (`key`) pour pouvoir référencer le lieu créé plus bas
  // (blocked periods, réservations) une fois son id réel connu.
  // ============================================
  const placesData = [
    {
      key: 'campus-standard',
      title: { fr: 'Campus EPFL (Standard)', en: 'EPFL Campus (Standard)' },
      picture: 'https://www.epfl.ch/campus/visitors/wp-content/uploads/2019/04/campus_rolex.jpg',
      description: { fr: 'Visite guidée générale du campus', en: 'General guided tour of the campus' },
      capacity: 20,
      price: 150,
      conditions: { fr: 'Bonnes chaussures recommandées', en: 'Good shoes recommended' },
      languageCodes: ['fr', 'en', 'de'],
    },
    {
      key: 'architecture-tour',
      title: { fr: 'Visite Architecture', en: 'Architecture Tour' },
      picture: 'https://www.epfl.ch/campus/visitors/wp-content/uploads/2019/04/artlab.jpg',
      description: { fr: 'Découverte des bâtiments emblématiques', en: 'Discovery of iconic buildings' },
      capacity: 15,
      price: 200,
      conditions: { fr: 'Aucune condition particulière', en: 'No special conditions' },
      languageCodes: ['fr', 'en'],
    },
    {
      key: 'rolex-learning-center',
      title: { fr: 'Rolex Learning Center', en: 'Rolex Learning Center' },
      picture: 'https://www.epfl.ch/campus/visitors/wp-content/uploads/2019/04/rolex-learning-center.jpg',
      description: { fr: 'Visite du bâtiment emblématique et de sa bibliothèque', en: 'Tour of the iconic building and its library' },
      capacity: 25,
      price: 100,
      conditions: { fr: "Silence requis à l'intérieur", en: 'Silence required inside' },
      languageCodes: ['fr', 'en', 'de', 'it'],
    },
    {
      key: 'research-labs',
      title: { fr: 'Laboratoires de recherche', en: 'Research Labs' },
      picture: 'https://www.epfl.ch/campus/visitors/wp-content/uploads/2019/04/labs.jpg',
      description: { fr: 'Découverte des laboratoires de pointe', en: 'Discovery of cutting-edge research labs' },
      capacity: 12,
      price: 250,
      conditions: { fr: 'Accès réservé aux plus de 16 ans', en: 'Access restricted to 16+' },
      languageCodes: ['fr', 'en'],
    },
    {
      key: 'artlab',
      title: { fr: 'ArtLab', en: 'ArtLab' },
      picture: 'https://www.epfl.ch/campus/visitors/wp-content/uploads/2019/04/artlab2.jpg',
      description: { fr: 'Visite du centre culturel et artistique', en: 'Tour of the cultural and art center' },
      capacity: 30,
      price: 120,
      conditions: { fr: 'Aucune condition particulière', en: 'No special conditions' },
      languageCodes: ['fr', 'en', 'de', 'it', 'es'],
    },
    {
      key: 'night-tour',
      title: { fr: 'Visite nocturne du campus', en: 'Night Campus Tour' },
      picture: 'https://www.epfl.ch/campus/visitors/wp-content/uploads/2019/04/campus-night.jpg',
      description: { fr: 'Découverte du campus illuminé en soirée', en: 'Discovery of the illuminated campus at night' },
      capacity: 18,
      price: 180,
      conditions: { fr: 'Vêtements chauds conseillés', en: 'Warm clothing recommended' },
      languageCodes: ['fr', 'en'],
    },
  ];

  const placeIdByKey: Record<string, number> = {};

  for (const place of placesData) {
    const { key, languageCodes, ...data } = place;
    const created = await prisma.place.create({
      data: {
        ...data,
        languages: {
          connect: languageCodes.map((code) => ({ id: languageIdByCode[code] })),
        },
      },
    });
    placeIdByKey[key] = created.id;
  }

  // ============================================
  // BLOCKED PERIODS (données préparées ici pour pouvoir
  // référencer les guides et places une fois créés plus bas)
  // ============================================
  const currentYear = new Date().getFullYear();

  const blockedPeriodsData = [
    {
      label: { fr: "Fermeture de fin d'année", en: 'Year-end closure' },
      start: new Date(currentYear, 11, 24),
      end: new Date(currentYear + 1, 0, 3),
      placeKeys: ['campus-standard', 'architecture-tour', 'rolex-learning-center', 'research-labs', 'artlab', 'night-tour'],
      guideIds: [111111, 222222, 333333, 444444, 555555, 666666],
    },
    {
      label: { fr: 'Maintenance Rolex Learning Center', en: 'Rolex Learning Center maintenance' },
      start: new Date(currentYear, 2, 10),
      end: new Date(currentYear, 2, 14),
      placeKeys: ['rolex-learning-center'],
      guideIds: [],
    },
    {
      label: { fr: 'Vacances académiques été', en: 'Summer academic break' },
      start: new Date(currentYear, 6, 15),
      end: new Date(currentYear, 7, 15),
      placeKeys: ['research-labs'],
      guideIds: [444444, 666666],
    },
    {
      label: { fr: 'Indisponibilité guide - congé', en: 'Guide unavailability - leave' },
      start: new Date(currentYear, 4, 1),
      end: new Date(currentYear, 4, 10),
      placeKeys: [],
      guideIds: [222222],
    },
  ];

  // ============================================
  // USERS & GUIDES
  // Guide.id partage la clé primaire de User.id, donc on
  // crée le User d'abord, puis le Guide avec le même id.
  // Ici l'id EST explicite volontairement : il correspond au sciper
  // EPFL (voir GuideService.create, qui utilise le même id pour User
  // et Guide), une source externe, pas une valeur autoincrement.
  // ============================================
  const guidesData = [
    {
      id: 111111,
      status: 'ACTIVE' as const,
      phone: ['+41 21 693 11 11'],
      languageCodes: ['fr', 'en'],
      placeKeys: ['campus-standard', 'architecture-tour', 'night-tour'],
      user: {
        firstName: 'Alice',
        lastName: 'Martin',
        username: 'amartin',
      },
    },
    {
      id: 222222,
      status: 'ACTIVE' as const,
      phone: ['+41 21 693 22 22'],
      languageCodes: ['fr', 'en', 'de'],
      placeKeys: ['campus-standard', 'rolex-learning-center', 'night-tour'],
      user: {
        firstName: 'Bob',
        lastName: 'Dupont',
        username: 'bdupont',
      },
    },
    {
      id: 333333,
      status: 'ACTIVE' as const,
      phone: ['+41 21 693 33 33'],
      languageCodes: ['fr', 'it'],
      placeKeys: ['rolex-learning-center', 'artlab'],
      user: {
        firstName: 'Chiara',
        lastName: 'Rossi',
        username: 'crossi',
      },
    },
    {
      id: 444444,
      status: 'INACTIVE' as const,
      phone: ['+41 21 693 44 44'],
      languageCodes: ['fr', 'en', 'es'],
      placeKeys: ['artlab', 'research-labs'],
      user: {
        firstName: 'David',
        lastName: 'Fernandez',
        username: 'dfernandez',
      },
    },
    {
      id: 555555,
      status: 'ACTIVE' as const,
      phone: ['+41 21 693 55 55'],
      languageCodes: ['en', 'de'],
      placeKeys: ['rolex-learning-center', 'research-labs', 'campus-standard'],
      user: {
        firstName: 'Emma',
        lastName: 'Müller',
        username: 'emuller',
      },
    },
    {
      id: 666666,
      status: 'RETIRED' as const,
      phone: ['+41 21 693 66 66'],
      languageCodes: ['fr', 'en', 'de', 'it', 'es', 'pt'],
      placeKeys: ['artlab', 'research-labs', 'rolex-learning-center', 'campus-standard', 'architecture-tour', 'night-tour'],
      user: {
        firstName: 'Fabio',
        lastName: 'Pereira',
        username: 'fpereira',
      },
    },
  ];
  let i = 0
  for (const guide of guidesData) {
    const { languageCodes, placeKeys, user, id, status, phone } = guide;

    await prisma.user.create({
      data: {
        id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: your_email_user + `+${i}@` + domain,
        username: user.username,
      },
    });

    await prisma.guide.create({
      data: {
        id,
        status,
        phone,
        languages: {
          connect: languageCodes.map((code) => ({ id: languageIdByCode[code] })),
        },
        places: {
          connect: placeKeys.map((key) => ({ id: placeIdByKey[key] })),
        },
      },
    });
    i += 1
  }

  // ============================================
  // CRÉATION DES BLOCKED PERIODS
  // ============================================
  for (const period of blockedPeriodsData) {
    const { placeKeys, guideIds, ...data } = period;
    await prisma.blockedPeriod.create({
      data: {
        ...data,
        places: {
          connect: placeKeys.map((key) => ({ id: placeIdByKey[key] })),
        },
        guides: {
          connect: guideIds.map((guideId) => ({ id: guideId })),
        },
      },
    });
  }

  // ============================================
  // RESERVATIONS & RESERVATION GUIDES
  // Pas d'id explicite : Reservation.id est autoincrement, comme dans
  // le vrai flux applicatif (ReservationService.register).
  // ============================================
  const inDays = (n: number) => {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return d;
  };

  const reservationsData = [
    {
      firstName: 'Jean',
      lastName: 'Rousseau',
      company: 'Gymnase de la Cité',
      email: 'jean.rousseau@example.com',
      phone: '+41 21 000 00 00',
      address: 'Rue de la Cité 1',
      additionalAddress: null,
      city: 'Lausanne',
      zip: '1005',
      region: 'Vaud',
      country: 'Suisse',
      date: inDays(14),
      payment: 'Facture',
      participantNumber: 25,
      status: 'READY' as const,
      languageCode: 'fr',
      placeKey: 'campus-standard',
      comment: 'Classe de maturité scientifique',
      guideId: 111111,
      guideStatus: 'ACCEPTED' as const,
    },
    {
      firstName: 'John',
      lastName: 'Smith',
      company: 'Tech Corp',
      email: 'john.smith@techcorp.com',
      phone: '+44 7700 900000',
      address: '10 Innovation Way',
      additionalAddress: 'Floor 3',
      city: 'London',
      zip: '12345',
      region: 'Greater London',
      country: 'UK',
      date: inDays(14),
      payment: 'Sur place (Carte)',
      participantNumber: 10,
      status: 'WAITINGGUIDE' as const,
      languageCode: 'en',
      placeKey: 'architecture-tour',
      comment: null,
      guideId: null,
      guideStatus: null,
    },
    {
      firstName: 'Maria',
      lastName: 'Gonzalez',
      company: null,
      email: 'maria.gonzalez@example.com',
      phone: '+34 600 000 000',
      address: 'Calle Mayor 5',
      additionalAddress: null,
      city: 'Madrid',
      zip: '28001',
      region: 'Madrid',
      country: 'Espagne',
      date: inDays(30),
      payment: 'Sur place (Espèces)',
      participantNumber: 4,
      status: 'WAITINGVALIDATION' as const,
      languageCode: 'es',
      placeKey: 'artlab',
      comment: 'Visite en famille',
      guideId: 444444,
      guideStatus: 'WAITING' as const,
    },
    {
      firstName: 'Hans',
      lastName: 'Weber',
      company: 'Universität Zürich',
      email: 'hans.weber@uzh.ch',
      phone: '+41 44 000 00 00',
      address: 'Rämistrasse 71',
      additionalAddress: null,
      city: 'Zürich',
      zip: '8006',
      region: 'Zürich',
      country: 'Suisse',
      date: inDays(21),
      payment: 'Facture',
      participantNumber: 18,
      status: 'READY' as const,
      languageCode: 'de',
      placeKey: 'rolex-learning-center',
      comment: "Groupe d'étudiants en architecture",
      guideId: 555555,
      guideStatus: 'ACCEPTED' as const,
    },
    {
      firstName: 'Luigi',
      lastName: 'Bianchi',
      company: 'Politecnico di Milano',
      email: 'luigi.bianchi@polimi.it',
      phone: '+39 02 0000 0000',
      address: 'Piazza Leonardo da Vinci 32',
      additionalAddress: null,
      city: 'Milano',
      zip: '20133',
      region: 'Lombardia',
      country: 'Italie',
      date: inDays(45),
      payment: 'Facture',
      participantNumber: 30,
      status: 'WAITINGGUIDE' as const,
      languageCode: 'it',
      placeKey: 'rolex-learning-center',
      comment: null,
      guideId: null,
      guideStatus: null,
    },
    {
      firstName: 'Sophie',
      lastName: 'Lambert',
      company: null,
      email: 'sophie.lambert@example.com',
      phone: '+33 6 00 00 00 00',
      address: '12 Rue de la Paix',
      additionalAddress: 'Appartement 4',
      city: 'Paris',
      zip: '75002',
      region: 'Île-de-France',
      country: 'France',
      date: inDays(7),
      payment: 'Sur place (Carte)',
      participantNumber: 2,
      status: 'WAITINGVALIDATION' as const,
      languageCode: 'fr',
      placeKey: 'night-tour',
      comment: 'Visite en couple',
      guideId: 222222,
      guideStatus: 'WAITING' as const,
    },
    {
      firstName: 'Anna',
      lastName: 'Kowalski',
      company: 'Lycée International',
      email: 'anna.kowalski@lycee.edu',
      phone: '+48 22 000 00 00',
      address: 'ul. Marszałkowska 1',
      additionalAddress: null,
      city: 'Warszawa',
      zip: '00-001',
      region: 'Mazowieckie',
      country: 'Pologne',
      date: inDays(60),
      payment: 'Facture',
      participantNumber: 22,
      status: 'WAITINGGUIDE' as const,
      languageCode: 'en',
      placeKey: 'campus-standard',
      comment: 'Échange scolaire',
      guideId: null,
      guideStatus: null,
    },
    {
      firstName: 'Pedro',
      lastName: 'Alves',
      company: null,
      email: 'pedro.alves@example.com',
      phone: '+351 91 000 00 00',
      address: 'Rua Augusta 100',
      additionalAddress: null,
      city: 'Lisboa',
      zip: '1100',
      region: 'Lisboa',
      country: 'Portugal',
      date: inDays(-10),
      payment: 'Sur place (Carte)',
      participantNumber: 6,
      status: 'READY' as const,
      languageCode: 'pt',
      placeKey: 'research-labs',
      comment: 'Visite déjà effectuée',
      guideId: 666666,
      guideStatus: 'ACCEPTED' as const,
    },
    {
      firstName: 'Emily',
      lastName: 'Clark',
      company: 'MIT',
      email: 'emily.clark@mit.edu',
      phone: '+1 617 000 0000',
      address: '77 Massachusetts Ave',
      additionalAddress: null,
      city: 'Cambridge',
      zip: '02139',
      region: 'MA',
      country: 'USA',
      date: inDays(90),
      payment: 'Facture',
      participantNumber: 15,
      status: 'READY' as const,
      languageCode: 'en',
      placeKey: 'research-labs',
      comment: 'Délégation académique',
      guideId: 555555,
      guideStatus: 'ACCEPTED' as const,
    },
    {
      firstName: 'Lucas',
      lastName: 'Bernard',
      company: null,
      email: 'lucas.bernard@example.com',
      phone: '+41 79 000 00 00',
      address: 'Avenue de la Gare 3',
      additionalAddress: null,
      city: 'Genève',
      zip: '1201',
      region: 'Genève',
      country: 'Suisse',
      date: inDays(3),
      payment: 'Sur place (Espèces)',
      participantNumber: 1,
      status: 'WAITINGGUIDE' as const,
      languageCode: 'fr',
      placeKey: 'artlab',
      comment: null,
      guideId: null,
      guideStatus: null,
    },
    {
      firstName: 'Yuki',
      lastName: 'Tanaka',
      company: 'Tokyo Institute of Technology',
      email: 'yuki.tanaka@titech.ac.jp',
      phone: '+81 3 0000 0000',
      address: '2 Chome-12-1 Ōokayama',
      additionalAddress: null,
      city: 'Tokyo',
      zip: '152-8550',
      region: 'Tokyo',
      country: 'Japon',
      date: inDays(120),
      payment: 'Facture',
      participantNumber: 20,
      status: 'WAITINGPAYMENT' as const,
      languageCode: 'en',
      placeKey: 'rolex-learning-center',
      comment: 'Partenariat de recherche',
      guideId: null,
      guideStatus: null,
    },
    {
      firstName: 'Chloé',
      lastName: 'Favre',
      company: 'Gymnase de Nyon',
      email: 'chloe.favre@gymnyon.ch',
      phone: '+41 22 000 00 00',
      address: 'Route de Divonne 8',
      additionalAddress: null,
      city: 'Nyon',
      zip: '1260',
      region: 'Vaud',
      country: 'Suisse',
      date: inDays(-25),
      payment: 'Facture',
      participantNumber: 28,
      status: 'CANCELLED' as const,
      languageCode: 'fr',
      placeKey: 'campus-standard',
      comment: 'Visite annulée pour cause de grève',
      guideId: 111111,
      guideStatus: 'DECLINED' as const,
    },
  ];

  for (const res of reservationsData) {
    const { guideId, guideStatus, languageCode, placeKey, ...data } = res;

    await prisma.reservation.create({
      data: {
        ...data,
        languageId: languageIdByCode[languageCode],
        placeId: placeIdByKey[placeKey],
        ...(guideId
          ? {
            reservationGuides: {
              create: {
                guideId,
                status: guideStatus ?? 'WAITING',
                updatedAt: new Date(),
              },
            },
          }
          : {}),
      },
    });
  }

  console.log(
    'Seeding completed successfully: Languages, Places, Users, Guides, BlockedPeriods, Reservations'
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
