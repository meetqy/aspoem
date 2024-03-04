import * as OpenCC from "opencc-js";
/**
 * 转换为简体
 * @param cc
 * @returns
 */
export function convertToHans(cc: string) {
  const convert = OpenCC.Converter({ from: "tw", to: "cn" });
  return convert(cc);
}

/**
 * 转换为繁体
 * @param cc
 * @returns
 */
export function convertToHant(cc: string) {
  const convert = OpenCC.Converter({ from: "cn", to: "tw" });
  return convert(cc);
}
