import { staticSkillData } from "./StaticData";

export const userInputData = {
  "モンスター": {
    "物理肉質": 45,
    "属性肉質": 25,
    "怒り補正": "なし",
    "水やられ": false,
  },

  "武器": {
    "攻撃力": 330,
    "会心率": 0,
    "属性値": 0,
    "属性": "無属性",
    "スロット": "なし",
    "溜め段階": "Lv4",
    "矢タイプ": "連射Lv5",
    "ビン補正": "強撃ビン",
  },

  "ハンター": {
    "ヒトダマドリ": 0,
    "疾替えの書": "【朱】",
    "矢強化": false,
    "剛力の弓がけ": false,
    "飛翔にらみ撃ち": false,
    "強化太鼓の技": false,
    "強化咆哮の技": false,
    "アミキリアカネ": false,
    "鬼人薬G": false,
    "鬼人の粉塵": false,
    "力の護符": false,
    "力の爪": false,
    "種ホムラ": "怪力の種",
  },

  "食事": {
    "火事場": "火事場なし",
    "射撃術": "射撃術Lv4",
    "短期催眠": "短期催眠Lv3",
  },

  "旋律": {
    "攻撃旋律": false,
    "気炎の旋律": false,
    "属性旋律": false,
    "会心旋律": false,
  },

  "百竜装飾品": {
    "弱点特効【属性】": false,
    "種・系特効": false,
    "やられ特効": false,
    "鋼龍の魂": false,
    "劫血活性Lv1": false,
    "劫血活性Lv2": false,
    "天彗龍の魂": false,
  },

  "その他": {
    "キュリア": 2,
    "血氣覚醒": 2,
    "狂竜症【蝕】感染時割合": 25,
    "全属性耐性値": 150,
  },
  "スキル": generateSkillInputData(),
};

function generateSkillInputData() {
  let skillInputData = {};
  for (let skill in staticSkillData) {
    skillInputData[skill] = {
      "name": skill,
      "minLevel": 0,
      "activeRate": 100,
      "fixLevel": false,
    };
  }
  return skillInputData;
}
