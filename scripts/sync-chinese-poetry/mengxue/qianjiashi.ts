import { Dynasty } from "@/types";

import dataDizigui from "../../../chinese-poetry-master/蒙学/dizigui.json";
import { createAuthor, createCategory, createPoem } from "../utils";

export const syncDizigui = async () => {
  try {
    const categoryId = await createCategory("蒙学");

    console.log(`弟子规同步完成: ${dataDizigui.content.length} 个章节已导入`);
  } catch (error) {
    console.error("弟子规同步失败:", error);
    throw error;
  }
};
