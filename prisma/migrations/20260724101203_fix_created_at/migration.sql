/*
  Warnings:

  - The `createdAt` column on the `blockedPeriods` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `slug` on the `places` table. All the data in the column will be lost.
  - The `createdAt` column on the `places` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `updatedAt` column on the `reservationGuide` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `createdAt` column on the `reservations` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `title` on the `places` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `description` on the `places` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `conditions` on the `places` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "blockedPeriods" DROP COLUMN "createdAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "places" DROP COLUMN "slug",
DROP COLUMN "title",
ADD COLUMN     "title" JSONB NOT NULL,
DROP COLUMN "description",
ADD COLUMN     "description" JSONB NOT NULL,
DROP COLUMN "createdAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "conditions",
ADD COLUMN     "conditions" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "reservationGuide" DROP COLUMN "updatedAt",
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "reservations" DROP COLUMN "createdAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "placeLanguage" (
    "placeId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,

    CONSTRAINT "placeLanguage_pkey" PRIMARY KEY ("placeId","languageId")
);

-- AddForeignKey
ALTER TABLE "placeLanguage" ADD CONSTRAINT "placeLanguage_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "placeLanguage" ADD CONSTRAINT "placeLanguage_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "languages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
