import {
  Ma_Shan_Zheng,
  Long_Cang,
  Inter,
  ZCOOL_QingKe_HuangYou,
  Zhi_Mang_Xing,
} from "next/font/google";

const ma_shan_zheng = Ma_Shan_Zheng({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-ma-shan-zheng",
});

const long_cang = Long_Cang({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-long-cang",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const zcool_qingke_huangyou = ZCOOL_QingKe_HuangYou({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-zcool-qingke-huangyou",
});

const zhi_mang_xing = Zhi_Mang_Xing({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-zhi-mang-xing",
});

export const getFont = () => ({
  ma_shan_zheng,
  long_cang,
  inter,
  zcool_qingke_huangyou,
  zhi_mang_xing,
});
