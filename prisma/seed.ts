import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL ?? '',
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // ============================================
  // CLEANUP (reverse dependency order)
  // ============================================
  await prisma.reservationGuide.deleteMany();
  await prisma.blockedPeriodGuide.deleteMany();
  await prisma.blockedPeriodPlace.deleteMany();
  await prisma.placeLanguage.deleteMany();
  await prisma.guideLanguage.deleteMany();
  await prisma.users.deleteMany();
  await prisma.reservations.deleteMany();
  await prisma.guideInfo.deleteMany();
  await prisma.places.deleteMany();
  await prisma.blockedPeriods.deleteMany();
  await prisma.languages.deleteMany();
  await prisma.status.deleteMany();

  // ============================================
  // STATUS
  // ============================================
  const statuses = [
    { id: 1, status: 'PENDING' },
    { id: 2, status: 'CONFIRMED' },
    { id: 3, status: 'CANCELLED' },
    { id: 4, status: 'COMPLETED' },
  ];
  await prisma.status.createMany({ data: statuses });

  // ============================================
  // LANGUAGES
  // ============================================
  const languages = [
    { id: 1, name: 'Français' },
    { id: 2, name: 'English' },
    { id: 3, name: 'Deutsch' },
    { id: 4, name: 'Italiano' },
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
    }
  ];

  for (const place of placesData) {
    const { languageIds, ...data } = place;
    await prisma.places.create({
      data: {
        ...data,
        createdAt: new Date(),
        placeLanguages: {
          create: languageIds.map(id => ({ languageId: id }))
        }
      }
    });
  }

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
        givenName: 'Alice',
        lastName: 'Martin',
        email: 'alice.martin@epfl.ch',
        gaspar: 'amartin',
      }
    },
    {
      sciper: 222222,
      languages: 3,
      blockedPeriods: 0,
      statusId: 2,
      languageIds: [1, 2, 3],
      user: {
        givenName: 'Bob',
        lastName: 'Dupont',
        email: 'bob.dupont@epfl.ch',
        gaspar: 'bdupont',
      }
    }
  ];

  for (const guide of guidesData) {
    const { languageIds, user, ...data } = guide;

    await prisma.guideInfo.create({
      data: {
        ...data,
        guideLanguages: {
          create: languageIds.map((id) => ({ languageId: id })),
        },
      },
    });

    await prisma.users.create({
      data: {
        sciper: data.sciper,
        givenName: user.givenName,
        lastName: user.lastName,
        email: user.email,
        gaspar: user.gaspar,
        guideInfoId: data.sciper
      }
    });
  }

  // ============================================
  // BLOCKED PERIODS
  // ============================================
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  await prisma.blockedPeriods.create({
    data: {
      label: "Fermeture de fin d'année",
      startDatetime: new Date(new Date().getFullYear(), 11, 24),
      endDatetime: new Date(new Date().getFullYear() + 1, 0, 3),
      createdAt: new Date(),
      blockedPeriodPlaces: {
        create: [{ placeId: 1 }, { placeId: 2 }]
      },
      blockedPeriodGuides: {
        create: [{ guideSciper: 111111 }, { guideSciper: 222222 }]
      }
    }
  });

  // ============================================
  // RESERVATIONS & RESERVATION GUIDES
  // ============================================
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 14);

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
      visitDate: futureDate,
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
      visitDate: futureDate,
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
    'Seeding completed successfully: Status, Languages, Places, Guides, Users, BlockedPeriods, Reservations'
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
