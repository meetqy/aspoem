-- AlterTable
ALTER TABLE "authors" ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "deathDate" TIMESTAMP(3),
ADD COLUMN     "epithets" TEXT,
ADD COLUMN     "introduce" TEXT,
ADD COLUMN     "style" TEXT;
