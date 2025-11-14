-- DropIndex
DROP INDEX "poems_updatedAt_idx";

-- AlterTable
ALTER TABLE "poems" ADD COLUMN     "isOrderliness" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "poems_updatedAt_visits_idx" ON "poems"("updatedAt", "visits");
