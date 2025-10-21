import { syncCaoCaoPoems } from "./caocao";
import { syncChuCiPoems } from "./chuci";
import { syncLunyuPoems } from "./lunyu";
import { syncBaijiaxing, syncDizigui } from "./mengxue";

function main() {
  syncCaoCaoPoems();
  syncChuCiPoems();
  syncLunyuPoems();
  syncBaijiaxing();
  syncDizigui();
}

main();
