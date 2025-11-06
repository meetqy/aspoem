-- AlterTable
ALTER TABLE "authors" ADD COLUMN     "visits" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "poems" ADD COLUMN     "visits" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "tags" ADD COLUMN     "visits" INTEGER NOT NULL DEFAULT 0;
