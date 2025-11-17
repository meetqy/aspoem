-- DropIndex
DROP INDEX "poems_updatedAt_visits_idx";

-- CreateIndex
CREATE INDEX "poems_updatedAt_visits_searchText_idx" ON "poems"("updatedAt", "visits", "searchText");
