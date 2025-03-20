import { staticSkillData } from "./StaticData";

export const userInputData = {
  "モンスター": {
    "物理肉質": 45,
    "属性肉質": 25,
    "怒り補正": 1.0,
    "水やられ": false,
  },

  "武器": {
    "攻撃力": 200,
    "会心率": 0,
    "属性値": 0,
    "属性": "無属性",
    "スロット": "なし",
    "溜め段階": "Lv3",
    "モーション": "剛連射",
    "ビン補正": "接撃ビン",
  },

  "ハンター": {
    "力の護符": false,
    "オトモ:ちからの笛": false,
    "鬼人の粉塵": false,
    "怪力の種枠": "なし",
    "鬼人薬枠": "なし",
    "装衣": "なし",
  },

  "食事": {
    "お食事火事場術": false,
    "お食事水心術": false,
    "お食事ムラ気術大": false,
    "食事タイプ": "なし",
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
