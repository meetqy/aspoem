import { db } from '@/server/db'
import { syncCaocao } from './caocao'
import { syncChuci } from './chuci'
import { syncLunyu } from './lunyu'

function main() {
  // 初始化朝代
  const dynasties = ['先秦', '汉', '魏晋', '南北朝', '隋', '唐', '五代十国', '宋', '元', '明', '清', '近现代', '东汉末年', '北宋', '春秋', '楚', '战国']
  Promise.all(
    dynasties.map(dynasty =>
      db.dynasty.upsert({
        where: { name: dynasty },
        update: {},
        create: { name: dynasty },
      }),
    ),
  ).then(() => {
    console.log('朝代初始化完成')
    syncCaocao()
    syncLunyu()
    syncChuci()
    // syncBaijiaxing();
    // syncDizigui();
    // syncGuwenguanzhi();
    // syncQianjiashi()
  })
}

main()
