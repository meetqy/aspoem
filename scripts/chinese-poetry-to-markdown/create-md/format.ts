export function replacePunctuation(text: string) {
  const enSymbols = [',', '.', ';', ':', '?', '!', '"', '"', '\'', '\'', '(', ')', '[', ']', '<', '>']
  const cnSymbols = ['，', '。', '；', '：', '？', '！', '"', '"', '\'', '\'', '（', '）', '【', '】', '《', '》']

  let result = text
  enSymbols.forEach((en, i) => {
    result = result.replace(new RegExp(`\\${en}`, 'g'), cnSymbols[i]!)
  })

  // 清理符号前后的多余空格，只保留一个
  result = result.replace(/\s+([，。；：？！"'（）【】《》])\s+/g, ' $1 ') // 符号前后有多个空格，保留一个
  result = result.replace(/\s+([，。；：？！"'（）【】《》])/g, ' $1') // 符号前有多个空格，保留一个
  result = result.replace(/([，。；：？！"'（）【】《》])\s+/g, '$1 ') // 符号后有多个空格，保留一个

  return result
}

export function splitLine(text: string) {
  return text.split(/[\n\r]+/).map(line => line.trim()).filter(line => line.length > 0)
}
