/*
  Warnings:

  - You are about to drop the column `date` on the `reservations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "reservations" DROP COLUMN "date",
ADD COLUMN     "visitDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
CREATE SEQUENCE status_id_seq;
ALTER TABLE "status" ALTER COLUMN "id" SET DEFAULT nextval('status_id_seq');
ALTER SEQUENCE status_id_seq OWNED BY "status"."id";
ALTER TABLE "reservations" RENAME COLUMN entreprise TO company;
