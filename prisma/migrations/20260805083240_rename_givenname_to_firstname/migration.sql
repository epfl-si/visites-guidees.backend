/*
  Warnings:

  - You are about to drop the column `givenName` on the `Users` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "givenName",
ADD COLUMN     "firstName" TEXT NOT NULL;
