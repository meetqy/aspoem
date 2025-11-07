/*
  Warnings:

  - The `epithets` column on the `authors` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "authors" DROP COLUMN "epithets",
ADD COLUMN     "epithets" TEXT[];
