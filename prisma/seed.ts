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
  // ============================================
  const languagesData = [
    { id: 1, code: 'fr', name: 'Français' },
    { id: 2, code: 'en', name: 'English' },
    { id: 3, code: 'de', name: 'Deutsch' },
    { id: 4, code: 'it', name: 'Italiano' },
    { id: 5, code: 'es', name: 'Español' },
    { id: 6, code: 'pt', name: 'Português' },
  ];
  await prisma.language.createMany({ data: languagesData });

  // ============================================
  // PLACES
  // ============================================
  const placesData = [
    {
      id: 1,
      title: { fr: 'Campus EPFL (Standard)', en: 'EPFL Campus (Standard)' },
      picture: 'https://www.epfl.ch/campus/visitors/wp-content/uploads/2019/04/campus_rolex.jpg',
      description: { fr: 'Visite guidée générale du campus', en: 'General guided tour of the campus' },
      capacity: 20,
      price: 150,
      conditions: { fr: 'Bonnes chaussures recommandées', en: 'Good shoes recommended' },
      languageIds: [1, 2, 3],
    },
    {
      id: 2,
      title: { fr: 'Visite Architecture', en: 'Architecture Tour' },
      picture: 'https://www.epfl.ch/campus/visitors/wp-content/uploads/2019/04/artlab.jpg',
      description: { fr: 'Découverte des bâtiments emblématiques', en: 'Discovery of iconic buildings' },
      capacity: 15,
      price: 200,
      conditions: { fr: 'Aucune condition particulière', en: 'No special conditions' },
      languageIds: [1, 2],
    },
    {
      id: 3,
      title: { fr: 'Rolex Learning Center', en: 'Rolex Learning Center' },
      picture: 'https://www.epfl.ch/campus/visitors/wp-content/uploads/2019/04/rolex-learning-center.jpg',
      description: { fr: 'Visite du bâtiment emblématique et de sa bibliothèque', en: 'Tour of the iconic building and its library' },
      capacity: 25,
      price: 100,
      conditions: { fr: "Silence requis à l'intérieur", en: 'Silence required inside' },
      languageIds: [1, 2, 3, 4],
    },
    {
      id: 4,
      title: { fr: 'Laboratoires de recherche', en: 'Research Labs' },
      picture: 'https://www.epfl.ch/campus/visitors/wp-content/uploads/2019/04/labs.jpg',
      description: { fr: 'Découverte des laboratoires de pointe', en: 'Discovery of cutting-edge research labs' },
      capacity: 12,
      price: 250,
      conditions: { fr: 'Accès réservé aux plus de 16 ans', en: 'Access restricted to 16+' },
      languageIds: [1, 2],
    },
    {
      id: 5,
      title: { fr: 'ArtLab', en: 'ArtLab' },
      picture: 'https://www.epfl.ch/campus/visitors/wp-content/uploads/2019/04/artlab2.jpg',
      description: { fr: 'Visite du centre culturel et artistique', en: 'Tour of the cultural and art center' },
      capacity: 30,
      price: 120,
      conditions: { fr: 'Aucune condition particulière', en: 'No special conditions' },
      languageIds: [1, 2, 3, 4, 5],
    },
    {
      id: 6,
      title: { fr: 'Visite nocturne du campus', en: 'Night Campus Tour' },
      picture: 'https://www.epfl.ch/campus/visitors/wp-content/uploads/2019/04/campus-night.jpg',
      description: { fr: 'Découverte du campus illuminé en soirée', en: 'Discovery of the illuminated campus at night' },
      capacity: 18,
      price: 180,
      conditions: { fr: 'Vêtements chauds conseillés', en: 'Warm clothing recommended' },
      languageIds: [1, 2],
    },
  ];

  for (const place of placesData) {
    const { languageIds, ...data } = place;
    await prisma.place.create({
      data: {
        ...data,
        languages: {
          connect: languageIds.map((id) => ({ id })),
        },
      },
    });
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
      placeIds: [1, 2, 3, 4, 5, 6],
      guideIds: [111111, 222222, 333333, 444444, 555555, 666666],
    },
    {
      label: { fr: 'Maintenance Rolex Learning Center', en: 'Rolex Learning Center maintenance' },
      start: new Date(currentYear, 2, 10),
      end: new Date(currentYear, 2, 14),
      placeIds: [3],
      guideIds: [],
    },
    {
      label: { fr: 'Vacances académiques été', en: 'Summer academic break' },
      start: new Date(currentYear, 6, 15),
      end: new Date(currentYear, 7, 15),
      placeIds: [4],
      guideIds: [444444, 666666],
    },
    {
      label: { fr: 'Indisponibilité guide - congé', en: 'Guide unavailability - leave' },
      start: new Date(currentYear, 4, 1),
      end: new Date(currentYear, 4, 10),
      placeIds: [],
      guideIds: [222222],
    },
  ];

  // ============================================
  // USERS & GUIDES
  // Guide.id partage la clé primaire de User.id, donc on
  // crée le User d'abord, puis le Guide avec le même id.
  // ============================================
  const guidesData = [
    {
      id: 111111,
      status: 'ACTIVE' as const,
      phone: ['+41 21 693 11 11'],
      languageIds: [1, 2],
      user: {
        firstName: 'Alice',
        lastName: 'Martin',
        email: 'alice.martin@epfl.ch',
        username: 'amartin',
      },
    },
    {
      id: 222222,
      status: 'ACTIVE' as const,
      phone: ['+41 21 693 22 22'],
      languageIds: [1, 2, 3],
      user: {
        firstName: 'Bob',
        lastName: 'Dupont',
        email: 'bob.dupont@epfl.ch',
        username: 'bdupont',
      },
    },
    {
      id: 333333,
      status: 'ACTIVE' as const,
      phone: ['+41 21 693 33 33'],
      languageIds: [1, 4],
      user: {
        firstName: 'Chiara',
        lastName: 'Rossi',
        email: 'chiara.rossi@epfl.ch',
        username: 'crossi',
      },
    },
    {
      id: 444444,
      status: 'INACTIVE' as const,
      phone: ['+41 21 693 44 44'],
      languageIds: [1, 2, 5],
      user: {
        firstName: 'David',
        lastName: 'Fernandez',
        email: 'david.fernandez@epfl.ch',
        username: 'dfernandez',
      },
    },
    {
      id: 555555,
      status: 'ACTIVE' as const,
      phone: ['+41 21 693 55 55'],
      languageIds: [2, 3],
      user: {
        firstName: 'Emma',
        lastName: 'Müller',
        email: 'emma.muller@epfl.ch',
        username: 'emuller',
      },
    },
    {
      id: 666666,
      status: 'RETIRED' as const,
      phone: ['+41 21 693 66 66'],
      languageIds: [1, 2, 3, 4, 5, 6],
      user: {
        firstName: 'Fabio',
        lastName: 'Pereira',
        email: 'fabio.pereira@epfl.ch',
        username: 'fpereira',
      },
    },
  ];

  for (const guide of guidesData) {
    const { languageIds, user, id, status, phone } = guide;

    await prisma.user.create({
      data: {
        id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      },
    });

    await prisma.guide.create({
      data: {
        id,
        status,
        phone,
        languages: {
          connect: languageIds.map((langId) => ({ id: langId })),
        },
      },
    });
  }

  // ============================================
  // CRÉATION DES BLOCKED PERIODS
  // ============================================
  for (const period of blockedPeriodsData) {
    const { placeIds, guideIds, ...data } = period;
    await prisma.blockedPeriod.create({
      data: {
        ...data,
        places: {
          connect: placeIds.map((placeId) => ({ id: placeId })),
        },
        guides: {
          connect: guideIds.map((guideId) => ({ id: guideId })),
        },
      },
    });
  }

  // ============================================
  // RESERVATIONS & RESERVATION GUIDES
  // ============================================
  const inDays = (n: number) => {
    const d = new Date();
    d.setDate(d.getDate() + n);
    return d;
  };

  const reservationsData = [
    {
      id: 1,
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
      languageId: 1,
      placeId: 1,
      comment: 'Classe de maturité scientifique',
      guideId: 111111,
      guideStatus: 'ACCEPTED' as const,
    },
    {
      id: 2,
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
      languageId: 2,
      placeId: 2,
      comment: null,
      guideId: null,
      guideStatus: null,
    },
    {
      id: 3,
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
      languageId: 5,
      placeId: 5,
      comment: 'Visite en famille',
      guideId: 444444,
      guideStatus: 'WAITING' as const,
    },
    {
      id: 4,
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
      languageId: 3,
      placeId: 3,
      comment: "Groupe d'étudiants en architecture",
      guideId: 555555,
      guideStatus: 'ACCEPTED' as const,
    },
    {
      id: 5,
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
      languageId: 4,
      placeId: 3,
      comment: null,
      guideId: null,
      guideStatus: null,
    },
    {
      id: 6,
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
      languageId: 1,
      placeId: 6,
      comment: 'Visite en couple',
      guideId: 222222,
      guideStatus: 'WAITING' as const,
    },
    {
      id: 7,
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
      languageId: 2,
      placeId: 1,
      comment: 'Échange scolaire',
      guideId: null,
      guideStatus: null,
    },
    {
      id: 8,
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
      languageId: 6,
      placeId: 4,
      comment: 'Visite déjà effectuée',
      guideId: 666666,
      guideStatus: 'ACCEPTED' as const,
    },
    {
      id: 9,
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
      languageId: 2,
      placeId: 4,
      comment: 'Délégation académique',
      guideId: 555555,
      guideStatus: 'ACCEPTED' as const,
    },
    {
      id: 10,
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
      languageId: 1,
      placeId: 5,
      comment: null,
      guideId: null,
      guideStatus: null,
    },
    {
      id: 11,
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
      languageId: 2,
      placeId: 3,
      comment: 'Partenariat de recherche',
      guideId: null,
      guideStatus: null,
    },
    {
      id: 12,
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
      languageId: 1,
      placeId: 1,
      comment: 'Visite annulée pour cause de grève',
      guideId: 111111,
      guideStatus: 'DECLINED' as const,
    },
  ];

  for (const res of reservationsData) {
    const { guideId, guideStatus, ...data } = res;

    await prisma.reservation.create({
      data: {
        ...data,
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