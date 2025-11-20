import fs from "fs-extra";
import { pinyin } from "pinyin-pro";
import slugify from "slugify";
import { db } from "@/server/db";

const { readJsonSync, readdirSync } = fs;

// Helper function to process items in batches
async function processBatch(items: any[], type: "ci" | "poet") {
  const BATCH_SIZE = 10;
  let processedCount = 0;

  // Loop through items in chunks of BATCH_SIZE
  for (let i = 0; i < items.length; i += BATCH_SIZE) {
    const batch = items.slice(i, i + BATCH_SIZE);

    await Promise.all(
      batch.map(async (item: any) => {
        const author = item.author;
        // For 'ci' use rhythmic, for 'poet' use title
        const title = type === "ci" ? item.rhythmic : item.title;

        const slug = slugify(pinyin(author + title, { toneType: "none" }));
        const visits =
          item.baidu + item.so360 + item.bing + item.bing_en + item.google;

        try {
          await db.poem.update({
            where: { slug },
            data: { visits },
          });
          processedCount++;
          // Optional: log individual success if needed, but it might be too noisy
        } catch (err) {
          // Ignore errors (e.g. poem not found) or log them
          // console.error(`Failed to update visits for ${slug}`);
        }
      }),
    );

    console.log(`[${type}] Progress: ${processedCount}/${items.length}`);
  }
}

export async function syncRank() {
  // Process CI files
  const ciFiles = readdirSync("chinese-poetry-master/rank/ci");
  for (const file of ciFiles) {
    console.log(`Processing CI file: ${file}`);
    const rank = readJsonSync(`chinese-poetry-master/rank/ci/${file}`);
    await processBatch(rank, "ci");
  }

  // Process Poet files
  const poetFiles = readdirSync("chinese-poetry-master/rank/poet");
  for (const file of poetFiles) {
    console.log(`Processing Poet file: ${file}`);
    const rank = readJsonSync(`chinese-poetry-master/rank/poet/${file}`);
    await processBatch(rank, "poet");
  }

  console.log("Sync rank completed!");
}
