/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "reservations" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "entreprise" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "additionnalAddress" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zip" INTEGER NOT NULL,
    "region" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "payment" TEXT NOT NULL,
    "numberOfParticipant" INTEGER NOT NULL,
    "statusId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,
    "placeId" INTEGER NOT NULL,

    CONSTRAINT "reservations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blockedPeriods" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,
    "startDatetime" TIMESTAMP(3) NOT NULL,
    "endDatetime" TIMESTAMP(3) NOT NULL,
    "createdAt" TEXT NOT NULL,

    CONSTRAINT "blockedPeriods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "languages" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "languages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "sciper" INTEGER NOT NULL,
    "givenName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "gaspar" TEXT NOT NULL,
    "guideInfoId" INTEGER NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("sciper")
);

-- CreateTable
CREATE TABLE "places" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "picture" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,
    "maxPerGroup" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "conditions" TEXT NOT NULL,

    CONSTRAINT "places_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blockedPeriodPlace" (
    "placeId" INTEGER NOT NULL,
    "blockedPeriodId" INTEGER NOT NULL,

    CONSTRAINT "blockedPeriodPlace_pkey" PRIMARY KEY ("placeId","blockedPeriodId")
);

-- CreateTable
CREATE TABLE "guideLanguage" (
    "guideId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,

    CONSTRAINT "guideLanguage_pkey" PRIMARY KEY ("guideId","languageId")
);

-- CreateTable
CREATE TABLE "blockedPeriodGuide" (
    "guideSciper" INTEGER NOT NULL,
    "blockedPeriodId" INTEGER NOT NULL,

    CONSTRAINT "blockedPeriodGuide_pkey" PRIMARY KEY ("guideSciper","blockedPeriodId")
);

-- CreateTable
CREATE TABLE "status" (
    "id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservationGuide" (
    "reservationId" INTEGER NOT NULL,
    "guideSciper" INTEGER NOT NULL,
    "updatedAt" TEXT NOT NULL,
    "statusId" INTEGER NOT NULL,

    CONSTRAINT "reservationGuide_pkey" PRIMARY KEY ("reservationId")
);

-- CreateTable
CREATE TABLE "guideInfo" (
    "sciper" INTEGER NOT NULL,
    "languages" INTEGER NOT NULL,
    "blockedPeriods" INTEGER NOT NULL,
    "statusId" INTEGER NOT NULL,

    CONSTRAINT "guideInfo_pkey" PRIMARY KEY ("sciper")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_gaspar_key" ON "Users"("gaspar");

-- CreateIndex
CREATE UNIQUE INDEX "guideInfo_sciper_key" ON "guideInfo"("sciper");

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_guideInfoId_fkey" FOREIGN KEY ("guideInfoId") REFERENCES "guideInfo"("sciper") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blockedPeriodPlace" ADD CONSTRAINT "blockedPeriodPlace_blockedPeriodId_fkey" FOREIGN KEY ("blockedPeriodId") REFERENCES "blockedPeriods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blockedPeriodPlace" ADD CONSTRAINT "blockedPeriodPlace_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guideLanguage" ADD CONSTRAINT "guideLanguage_guideId_fkey" FOREIGN KEY ("guideId") REFERENCES "guideInfo"("sciper") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guideLanguage" ADD CONSTRAINT "guideLanguage_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blockedPeriodGuide" ADD CONSTRAINT "blockedPeriodGuide_blockedPeriodId_fkey" FOREIGN KEY ("blockedPeriodId") REFERENCES "blockedPeriods"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blockedPeriodGuide" ADD CONSTRAINT "blockedPeriodGuide_guideSciper_fkey" FOREIGN KEY ("guideSciper") REFERENCES "guideInfo"("sciper") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservationGuide" ADD CONSTRAINT "reservationGuide_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "reservations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservationGuide" ADD CONSTRAINT "reservationGuide_guideSciper_fkey" FOREIGN KEY ("guideSciper") REFERENCES "guideInfo"("sciper") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservationGuide" ADD CONSTRAINT "reservationGuide_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guideInfo" ADD CONSTRAINT "guideInfo_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
