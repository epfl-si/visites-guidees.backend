-- AlterTable
ALTER TABLE "reservations" ADD COLUMN     "comments" TEXT,
ALTER COLUMN "additionnalAddress" DROP NOT NULL;
