/*
  Warnings:

  - You are about to drop the column `guideInfoId` on the `Users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_guideInfoId_fkey";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "guideInfoId";

-- AddForeignKey
ALTER TABLE "guideInfo" ADD CONSTRAINT "guideInfo_sciper_fkey" FOREIGN KEY ("sciper") REFERENCES "Users"("sciper") ON DELETE RESTRICT ON UPDATE CASCADE;
