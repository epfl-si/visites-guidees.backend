/*
  Warnings:

  - Added the required column `phone` to the `guideInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "guideInfo" ADD COLUMN     "phone" TEXT NOT NULL;
