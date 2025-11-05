// import { syncLunyu } from './lunyu'
// import { syncGuwenguanzhi } from './mengxue/guwenguanzhi'
// import { syncShenglvqimeng } from './mengxue/shenglvqimeng'
import { syncCaocao } from "./caocao";
import { syncChuci } from "./chuci";
import { syncBaijiaxing } from "./mengxue/baijiaxing";
import { syncDizigui } from "./mengxue/dizigui";
import { syncQianjiashi } from "./mengxue/qianjiashi";
import { syncQianziwen } from "./mengxue/qianziwen";
import { syncSanzijing } from "./mengxue/sanzijin";
import { syncSanzijingNew } from "./mengxue/sanzijin-new";
import { syncTangshisanbaishou } from "./mengxue/tangshisanbaishou";
import { syncZhuzijiaxun } from "./mengxue/zhuzijiaxun";
import { syncNalan } from "./nalanxingde";
import { syncQuantangshi } from "./quantangshi";
import { syncShuiMoTangShi } from "./shuimotangshi";
import { syncSongCi } from "./songci";
import { syncWuDaiShiCiHuajinji, syncWuDaiShiNanTang } from "./wudaishici";
import { syncYuanQu } from "./yuanqu";
import { syncYDQuantangshi } from "./yudingquantangshi";

function main() {
  syncYuanQu();
  syncYDQuantangshi();
  syncWuDaiShiCiHuajinji();
  syncWuDaiShiNanTang();
  syncSongCi();
  syncShuiMoTangShi();
  syncQuantangshi();
  syncCaocao();
  syncChuci();
  syncBaijiaxing();
  syncDizigui();
  syncQianjiashi();
  syncQianziwen();
  syncSanzijingNew();
  syncSanzijing();
  syncTangshisanbaishou();
  syncZhuzijiaxun();
  syncNalan();

  // syncGuwenguanzhi()
  // syncShenglvqimeng()
  // syncLunyu()
}

main();
