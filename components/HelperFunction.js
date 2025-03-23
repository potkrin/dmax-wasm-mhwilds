// 複数のファイルで利用する関数を定義する

// カタカナをひらがなに変換する関数
export const katakanaToHiragana = (str) => {
  if (!str) return "";

  return str.replace(/[\u30A1-\u30F6]/g, (match) => {
    return String.fromCharCode(match.charCodeAt(0) - 0x60);
  });
};
