import pangu from "pangu";

export function replacePunctuation(text: string) {
  const enSymbols = [
    ",",
    ".",
    ";",
    ":",
    "?",
    "!",
    '"',
    '"',
    "'",
    "'",
    "(",
    ")",
    "[",
    "]",
    "<",
    ">",
  ];
  const cnSymbols = [
    "，",
    "。",
    "；",
    "：",
    "？",
    "！",
    '"',
    '"',
    "'",
    "'",
    "（",
    "）",
    "【",
    "】",
    "《",
    "》",
  ];

  let result = text;
  enSymbols.forEach((en, i) => {
    result = result.replace(new RegExp(`\\${en}`, "g"), cnSymbols[i]!);
  });

  // 清理符号前后的多余空格，只保留一个
  result = result.replace(/\s+([，。；：？！"'（）【】《》])\s+/g, " $1 "); // 符号前后有多个空格，保留一个
  result = result.replace(/\s+([，。；：？！"'（）【】《》])/g, " $1"); // 符号前有多个空格，保留一个
  result = result.replace(/([，。；：？！"'（）【】《》])\s+/g, "$1 "); // 符号后有多个空格，保留一个

  // 删除所有不规则空白符号
  // eslint-disable-next-line no-irregular-whitespace
  result = result
    .replace(/[\u00A0\u1680\u180E\u2000-\u200B\u202F\u205F\u3000\uFEFF]/g, "")
    .replaceAll(`　`, "")
    .replaceAll(`　`, "");

  return result;
}

export function splitLine(text: string) {
  const spacedText = pangu.spacingText(text); // 使用 pangu 进行中英文间距处理
  return spacedText
    .split(/[\n\r]+/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}
