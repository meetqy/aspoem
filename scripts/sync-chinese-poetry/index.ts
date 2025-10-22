import { syncCaocao } from "./caocao";
import { syncChuci } from "./chuci";
import { syncLunyu } from "./lunyu";
import { syncBaijiaxing } from "./mengxue/baijiaxing";
import { syncDizigui } from "./mengxue/dizigui";

function main() {
  syncCaocao();
  syncChuci();
  syncLunyu();
  syncBaijiaxing();
  syncDizigui();
}

main();
