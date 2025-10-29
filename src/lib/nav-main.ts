export interface NavMainItem {
  title: string
  url: string
  items?: NavMainItem[]
}

export const navMain: NavMainItem[] = [
  {
    title: '诗人',
    url: '#',
    items: [
      { title: '李白', url: '/author/li-bai' },
      { title: '杜甫', url: '/author/du-fu' },
      { title: '白居易', url: '/author/bai-ju-yi' },
    ],
  },
  {
    title: '朝代',
    url: '#',
    items: [
      { title: '唐代', url: '/dynasty/tang' },
      { title: '宋代', url: '/dynasty/song' },
      { title: '元代', url: '/dynasty/yuan' },
    ],
  },
]
