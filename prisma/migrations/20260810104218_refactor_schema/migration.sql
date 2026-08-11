/*
  Warnings:

  - You are about to drop the column `createdAt` on the `places` table. All the data in the column will be lost.
  - You are about to drop the column `maxPerGroup` on the `places` table. All the data in the column will be lost.
  - You are about to drop the column `additionnalAddress` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the column `comments` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the column `languageId` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the column `numberOfParticipant` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the column `placeId` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the column `statusId` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the column `visitDate` on the `reservations` table. All the data in the column will be lost.
  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `blockedPeriodGuide` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `blockedPeriodPlace` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `blockedPeriods` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `guideInfo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `guideLanguage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `placeLanguage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reservationGuide` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `status` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[code]` on the table `languages` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `languages` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `languages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `capacity` to the `places` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `places` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date` to the `reservations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `reservations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `language_id` to the `reservations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `reservations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `participant_number` to the `reservations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `place_id` to the `reservations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `reservations` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReservationStatus" AS ENUM ('WAITINGGUIDE', 'WAITINGVALIDATION', 'WAITINGPAYMENT', 'READY', 'CANCELLED');

-- CreateEnum
CREATE TYPE "GuideStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'RETIRED');

-- CreateEnum
CREATE TYPE "ReservationGuideStatus" AS ENUM ('ACCEPTED', 'DECLINED', 'WAITING', 'CHOSEN');

-- DropForeignKey
ALTER TABLE "blockedPeriodGuide" DROP CONSTRAINT "blockedPeriodGuide_blockedPeriodId_fkey";

-- DropForeignKey
ALTER TABLE "blockedPeriodGuide" DROP CONSTRAINT "blockedPeriodGuide_guideSciper_fkey";

-- DropForeignKey
ALTER TABLE "blockedPeriodPlace" DROP CONSTRAINT "blockedPeriodPlace_blockedPeriodId_fkey";

-- DropForeignKey
ALTER TABLE "blockedPeriodPlace" DROP CONSTRAINT "blockedPeriodPlace_placeId_fkey";

-- DropForeignKey
ALTER TABLE "guideInfo" DROP CONSTRAINT "guideInfo_sciper_fkey";

-- DropForeignKey
ALTER TABLE "guideInfo" DROP CONSTRAINT "guideInfo_statusId_fkey";

-- DropForeignKey
ALTER TABLE "guideLanguage" DROP CONSTRAINT "guideLanguage_guideId_fkey";

-- DropForeignKey
ALTER TABLE "guideLanguage" DROP CONSTRAINT "guideLanguage_languageId_fkey";

-- DropForeignKey
ALTER TABLE "placeLanguage" DROP CONSTRAINT "placeLanguage_languageId_fkey";

-- DropForeignKey
ALTER TABLE "placeLanguage" DROP CONSTRAINT "placeLanguage_placeId_fkey";

-- DropForeignKey
ALTER TABLE "reservationGuide" DROP CONSTRAINT "reservationGuide_guideSciper_fkey";

-- DropForeignKey
ALTER TABLE "reservationGuide" DROP CONSTRAINT "reservationGuide_reservationId_fkey";

-- DropForeignKey
ALTER TABLE "reservationGuide" DROP CONSTRAINT "reservationGuide_statusId_fkey";

-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_languageId_fkey";

-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_placeId_fkey";

-- DropForeignKey
ALTER TABLE "reservations" DROP CONSTRAINT "reservations_statusId_fkey";

-- AlterTable
ALTER TABLE "languages" ADD COLUMN     "code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "places" DROP COLUMN "createdAt",
DROP COLUMN "maxPerGroup",
ADD COLUMN     "capacity" INTEGER NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "reservations" DROP COLUMN "additionnalAddress",
DROP COLUMN "comments",
DROP COLUMN "createdAt",
DROP COLUMN "firstName",
DROP COLUMN "languageId",
DROP COLUMN "lastName",
DROP COLUMN "numberOfParticipant",
DROP COLUMN "placeId",
DROP COLUMN "statusId",
DROP COLUMN "visitDate",
ADD COLUMN     "additional_address" TEXT,
ADD COLUMN     "comment" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "language_id" INTEGER NOT NULL,
ADD COLUMN     "last_name" TEXT NOT NULL,
ADD COLUMN     "participant_number" INTEGER NOT NULL,
ADD COLUMN     "place_id" INTEGER NOT NULL,
ADD COLUMN     "status" "ReservationStatus" NOT NULL DEFAULT 'WAITINGGUIDE',
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "zip" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "Users";

-- DropTable
DROP TABLE "blockedPeriodGuide";

-- DropTable
DROP TABLE "blockedPeriodPlace";

-- DropTable
DROP TABLE "blockedPeriods";

-- DropTable
DROP TABLE "guideInfo";

-- DropTable
DROP TABLE "guideLanguage";

-- DropTable
DROP TABLE "placeLanguage";

-- DropTable
DROP TABLE "reservationGuide";

-- DropTable
DROP TABLE "status";

-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL,
    "last_name" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guides" (
    "id" SERIAL NOT NULL,
    "status" "GuideStatus" NOT NULL DEFAULT 'ACTIVE',
    "phone" TEXT[],

    CONSTRAINT "guides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blocked_periods" (
    "id" SERIAL NOT NULL,
    "label" JSONB NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blocked_periods_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reservations_guides" (
    "reservation_id" INTEGER NOT NULL,
    "guide_id" INTEGER NOT NULL,
    "status" "ReservationGuideStatus" NOT NULL DEFAULT 'WAITING',
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reservations_guides_pkey" PRIMARY KEY ("reservation_id","guide_id")
);

-- CreateTable
CREATE TABLE "_GuideToLanguage" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_GuideToLanguage_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_BlockedPeriodToPlace" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_BlockedPeriodToPlace_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_BlockedPeriodToGuide" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_BlockedPeriodToGuide_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_LanguageToPlace" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_LanguageToPlace_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE INDEX "_GuideToLanguage_B_index" ON "_GuideToLanguage"("B");

-- CreateIndex
CREATE INDEX "_BlockedPeriodToPlace_B_index" ON "_BlockedPeriodToPlace"("B");

-- CreateIndex
CREATE INDEX "_BlockedPeriodToGuide_B_index" ON "_BlockedPeriodToGuide"("B");

-- CreateIndex
CREATE INDEX "_LanguageToPlace_B_index" ON "_LanguageToPlace"("B");

-- CreateIndex
CREATE UNIQUE INDEX "languages_code_key" ON "languages"("code");

-- CreateIndex
CREATE UNIQUE INDEX "languages_name_key" ON "languages"("name");

-- AddForeignKey
ALTER TABLE "guides" ADD CONSTRAINT "guides_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_language_id_fkey" FOREIGN KEY ("language_id") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_place_id_fkey" FOREIGN KEY ("place_id") REFERENCES "places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations_guides" ADD CONSTRAINT "reservations_guides_reservation_id_fkey" FOREIGN KEY ("reservation_id") REFERENCES "reservations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reservations_guides" ADD CONSTRAINT "reservations_guides_guide_id_fkey" FOREIGN KEY ("guide_id") REFERENCES "guides"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GuideToLanguage" ADD CONSTRAINT "_GuideToLanguage_A_fkey" FOREIGN KEY ("A") REFERENCES "guides"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GuideToLanguage" ADD CONSTRAINT "_GuideToLanguage_B_fkey" FOREIGN KEY ("B") REFERENCES "languages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockedPeriodToPlace" ADD CONSTRAINT "_BlockedPeriodToPlace_A_fkey" FOREIGN KEY ("A") REFERENCES "blocked_periods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockedPeriodToPlace" ADD CONSTRAINT "_BlockedPeriodToPlace_B_fkey" FOREIGN KEY ("B") REFERENCES "places"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockedPeriodToGuide" ADD CONSTRAINT "_BlockedPeriodToGuide_A_fkey" FOREIGN KEY ("A") REFERENCES "blocked_periods"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlockedPeriodToGuide" ADD CONSTRAINT "_BlockedPeriodToGuide_B_fkey" FOREIGN KEY ("B") REFERENCES "guides"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LanguageToPlace" ADD CONSTRAINT "_LanguageToPlace_A_fkey" FOREIGN KEY ("A") REFERENCES "languages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LanguageToPlace" ADD CONSTRAINT "_LanguageToPlace_B_fkey" FOREIGN KEY ("B") REFERENCES "places"("id") ON DELETE CASCADE ON UPDATE CASCADE;
