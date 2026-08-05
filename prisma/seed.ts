import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL ?? '',
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // ============================================
  // CLEANUP (reverse dependency order)
  // Note: on ne touche pas à la table `status`,
  // elle est supposée déjà peuplée.
  // ============================================
  await prisma.reservationGuide.deleteMany();
  await prisma.blockedPeriodGuide.deleteMany();
  await prisma.blockedPeriodPlace.deleteMany();
  await prisma.placeLanguage.deleteMany();
  await prisma.guideLanguage.deleteMany();
  await prisma.guideInfo.deleteMany();
  await prisma.users.deleteMany();
  await prisma.reservations.deleteMany();
  await prisma.places.deleteMany();
  await prisma.blockedPeriods.deleteMany();
  await prisma.languages.deleteMany();

  // ============================================
  // LANGUAGES
  // ============================================
  const languages = [
    { id: 1, name: 'Français' },
    { id: 2, name: 'English' },
    { id: 3, name: 'Deutsch' },
    { id: 4, name: 'Italiano' },
    { id: 5, name: 'Español' },
    { id: 6, name: 'Português' },
  ];
  await prisma.languages.createMany({ data: languages });

  // ============================================
  // PLACES
  // ============================================
  const placesData = [
    {
      id: 1,
      title: { fr: 'Campus EPFL (Standard)', en: 'EPFL Campus (Standard)' },
      picture: 'https://www.epfl.ch/campus/visitors/wp-content/uploads/2019/04/campus_rolex.jpg',
      description: { fr: 'Visite guidée générale du campus', en: 'General guided tour of the campus' },
      maxPerGroup: 20,
      price: 150,
      conditions: { fr: 'Bonnes chaussures recommandées', en: 'Good shoes recommended' },
      languageIds: [1, 2, 3],
    },
    {
      id: 2,
      title: { fr: 'Visite Architecture', en: 'Architecture Tour' },
      picture: 'https://www.epfl.ch/campus/visitors/wp-content/uploads/2019/04/artlab.jpg',
      description: { fr: 'Découverte des bâtiments emblématiques', en: 'Discovery of iconic buildings' },
      maxPerGroup: 15,
      price: 200,
      conditions: { fr: 'Aucune condition particulière', en: 'No special conditions' },
      languageIds: [1, 2],
    },
    {
      id: 3,
      title: { fr: 'Rolex Learning Center', en: 'Rolex Learning Center' },
      picture: 'https://www.epfl.ch/campus/visitors/wp-content/uploads/2019/04/rolex-learning-center.jpg',
      description: { fr: 'Visite du bâtiment emblématique et de sa bibliothèque', en: 'Tour of the iconic building and its library' },
      maxPerGroup: 25,
      price: 100,
      conditions: { fr: "Silence requis à l'intérieur", en: 'Silence required inside' },
      languageIds: [1, 2, 3, 4],
    },
    {
      id: 4,
      title: { fr: 'Laboratoires de recherche', en: 'Research Labs' },
      picture: 'https://www.epfl.ch/campus/visitors/wp-content/uploads/2019/04/labs.jpg',
      description: { fr: 'Découverte des laboratoires de pointe', en: 'Discovery of cutting-edge research labs' },
      maxPerGroup: 12,
      price: 250,
      conditions: { fr: "Accès réservé aux plus de 16 ans", en: 'Access restricted to 16+' },
      languageIds: [1, 2],
    },
    {
      id: 5,
      title: { fr: 'ArtLab', en: 'ArtLab' },
      picture: 'https://www.epfl.ch/campus/visitors/wp-content/uploads/2019/04/artlab2.jpg',
      description: { fr: 'Visite du centre culturel et artistique', en: 'Tour of the cultural and art center' },
      maxPerGroup: 30,
      price: 120,
      conditions: { fr: 'Aucune condition particulière', en: 'No special conditions' },
      languageIds: [1, 2, 3, 4, 5],
    },
    {
      id: 6,
      title: { fr: 'Visite nocturne du campus', en: 'Night Campus Tour' },
      picture: 'https://www.epfl.ch/campus/visitors/wp-content/uploads/2019/04/campus-night.jpg',
      description: { fr: 'Découverte du campus illuminé en soirée', en: 'Discovery of the illuminated campus at night' },
      maxPerGroup: 18,
      price: 180,
      conditions: { fr: 'Vêtements chauds conseillés', en: 'Warm clothing recommended' },
      languageIds: [1, 2],
    },
  ];

  for (const place of placesData) {
    const { languageIds, ...data } = place;
    await prisma.places.create({
      data: {
        ...data,
        createdAt: new Date(),
        placeLanguages: {
          create: languageIds.map(id => ({ languageId: id })),
        },
      },
    });
  }

  // ============================================
  // BLOCKED PERIODS (données préparées ici pour pouvoir
  // calculer le compteur `blockedPeriods` de chaque guide)
  // ============================================
  const currentYear = new Date().getFullYear();

  const blockedPeriodsData = [
    {
      label: "Fermeture de fin d'année",
      startDatetime: new Date(currentYear, 11, 24),
      endDatetime: new Date(currentYear + 1, 0, 3),
      placeIds: [1, 2, 3, 4, 5, 6],
      guideScipers: [111111, 222222, 333333, 444444, 555555, 666666],
    },
    {
      label: 'Maintenance Rolex Learning Center',
      startDatetime: new Date(currentYear, 2, 10),
      endDatetime: new Date(currentYear, 2, 14),
      placeIds: [3],
      guideScipers: [],
    },
    {
      label: 'Vacances académiques été',
      startDatetime: new Date(currentYear, 6, 15),
      endDatetime: new Date(currentYear, 7, 15),
      placeIds: [4],
      guideScipers: [444444, 666666],
    },
    {
      label: 'Indisponibilité guide - congé',
      startDatetime: new Date(currentYear, 4, 1),
      endDatetime: new Date(currentYear, 4, 10),
      placeIds: [],
      guideScipers: [222222],
    },
  ];

  // ============================================
  // GUIDE INFO & USERS
  // ============================================
  const guidesData = [
    {
      sciper: 111111,
      languages: 2,
      blockedPeriods: 0,
      statusId: 2,
      languageIds: [1, 2],
      user: {
        firstName: 'Alice',
        lastName: 'Martin',
        email: 'alice.martin@epfl.ch',
        gaspar: 'amartin',
      },
    },
    {
      sciper: 222222,
      languages: 3,
      blockedPeriods: 0,
      statusId: 2,
      languageIds: [1, 2, 3],
      user: {
        firstName: 'Bob',
        lastName: 'Dupont',
        email: 'bob.dupont@epfl.ch',
        gaspar: 'bdupont',
      }
    }
  ];

  for (const guide of guidesData) {
    const { languageIds, user, ...data } = guide;

    // Le sciper est la clé partagée entre Users et guideInfo :
    // on doit créer le Users d'abord (contrainte de clé étrangère).
    await prisma.users.create({
      data: {
        sciper: data.sciper,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        gaspar: user.gaspar,
      },
    });

    await prisma.guideInfo.create({
      data: {
        ...data,
        guideLanguages: {
          create: languageIds.map((id) => ({ languageId: id })),
        },
      },
    });
  }

  // ============================================
  // CRÉATION DES BLOCKED PERIODS
  // ============================================
  for (const period of blockedPeriodsData) {
    const { placeIds, guideScipers, ...data } = period;
    await prisma.blockedPeriods.create({
      data: {
        ...data,
        createdAt: new Date(),
        blockedPeriodPlaces: {
          create: placeIds.map((placeId) => ({ placeId })),
        },
        blockedPeriodGuides: {
          create: guideScipers.map((guideSciper) => ({ guideSciper })),
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
      additionnalAddress: null,
      city: 'Lausanne',
      zip: 1005,
      region: 'Vaud',
      country: 'Suisse',
      visitDate: inDays(14),
      payment: 'Facture',
      numberOfParticipant: 25,
      statusId: 2,
      languageId: 1,
      placeId: 1,
      comments: 'Classe de maturité scientifique',
      guideSciper: 111111,
    },
    {
      id: 2,
      firstName: 'John',
      lastName: 'Smith',
      company: 'Tech Corp',
      email: 'john.smith@techcorp.com',
      phone: '+44 7700 900000',
      address: '10 Innovation Way',
      additionnalAddress: 'Floor 3',
      city: 'London',
      zip: 12345,
      region: 'Greater London',
      country: 'UK',
      visitDate: inDays(14),
      payment: 'Sur place (Carte)',
      numberOfParticipant: 10,
      statusId: 1,
      languageId: 2,
      placeId: 2,
      comments: null,
      guideSciper: null,
    }
  ];

  for (const res of reservationsData) {
    const { guideSciper, ...data } = res;

    await prisma.reservations.create({
      data: {
        ...data,
        createdAt: new Date(),
        ...(guideSciper
          ? {
            reservationGuide: {
              create: {
                guideSciper: guideSciper,
                statusId: 2, // Confirmé pour le guide
                updatedAt: new Date(),
              },
            },
          }
          : {}),
      },
    });
  }

  console.log(
    'Seeding completed successfully: Languages, Places, Guides, Users, BlockedPeriods, Reservations'
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