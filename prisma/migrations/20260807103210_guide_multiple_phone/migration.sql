/*
  Warnings:

  - The `phone` column on the `guideInfo` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "guideInfo" DROP COLUMN "phone",
ADD COLUMN     "phone" TEXT[];
