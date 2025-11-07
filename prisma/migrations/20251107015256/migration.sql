/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `poems` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `poems` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "poems_titleSlug_key";

-- AlterTable
ALTER TABLE "poems" ADD COLUMN     "dynastyId" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "poems_slug_key" ON "poems"("slug");

-- AddForeignKey
ALTER TABLE "poems" ADD CONSTRAINT "poems_dynastyId_fkey" FOREIGN KEY ("dynastyId") REFERENCES "dynasties"("id") ON DELETE SET NULL ON UPDATE CASCADE;
