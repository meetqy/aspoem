import { syncCaocao } from './caocao'
import { syncChuci } from './chuci'
import { syncLunyu } from './lunyu'
import { syncBaijiaxing } from './mengxue/baijiaxing'
import { syncDizigui } from './mengxue/dizigui'
import { syncGuwenguanzhi } from './mengxue/guwenguanzhi'
import { syncQianjiashi } from './mengxue/qianjiashi'
import { syncQianziwen } from './mengxue/qianziwen'
import { syncSanzijing } from './mengxue/sanzijin'
import { syncSanzijingNew } from './mengxue/sanzijin-new'
import { syncShenglvqimeng } from './mengxue/shenglvqimeng'

function main() {
  syncCaocao()
  syncLunyu()
  syncChuci()
  syncBaijiaxing()
  syncDizigui()
  syncGuwenguanzhi()
  syncQianjiashi()
  syncQianziwen()
  syncSanzijingNew()
  syncSanzijing()
  syncShenglvqimeng()
}

main()
