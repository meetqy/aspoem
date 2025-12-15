import { deleteAuthorsWithoutPoems } from "./delete-authors-without-poems";
import { syncPoemDynastyWithAuthor } from "./sync-poem-dynasty-with-author";

async function formatDatabase() {
  await deleteAuthorsWithoutPoems();
  await syncPoemDynastyWithAuthor();
}

formatDatabase()
  .then(() => {
    console.log("数据库格式化完成");
  })
  .catch((e) => {
    console.error("数据库格式化失败:", e);
    process.exit(1);
  });
