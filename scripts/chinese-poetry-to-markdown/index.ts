// import { syncLunyu } from './lunyu'
// import { syncGuwenguanzhi } from './mengxue/guwenguanzhi'
// import { syncShenglvqimeng } from './mengxue/shenglvqimeng'
import { syncQuantangshi } from './quantangshi'

function main() {
  syncQuantangshi()
  syncCaocao()
  syncChuci()
  syncBaijiaxing()
  syncDizigui()
  syncQianjiashi()
  syncQianziwen()
  syncSanzijingNew()
  syncSanzijing()
  syncTangshisanbaishou()
  syncZhuzijiaxun()
  syncNalan()

  // syncGuwenguanzhi()
  // syncShenglvqimeng()
  // syncLunyu()
}

main()
