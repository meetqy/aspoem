import { syncCaocao } from './caocao'
import { syncChuci } from './chuci'
import { syncLunyu } from './lunyu'
import { syncBaijiaxing } from './mengxue/baijiaxing'
import { syncDizigui } from './mengxue/dizigui'
import { syncGuwenguanzhi } from './mengxue/guwenguanzhi'
import { syncQianjiashi } from './mengxue/qianjiashi'
import { syncQianziwen } from './mengxue/qianziwen'

function main() {
  syncCaocao()
  syncLunyu()
  syncChuci()
  syncBaijiaxing()
  syncDizigui()
  syncGuwenguanzhi()
  syncQianjiashi()
  syncQianziwen()
}

main()
