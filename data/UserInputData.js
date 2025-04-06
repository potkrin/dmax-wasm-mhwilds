import { staticSkillData } from "./StaticData";

export const userInputData = {
  "モンスター": {
    "物理肉質": 45,
    "属性肉質": 25,
    "怒り補正": 1.0,
    "水やられ": false,
  },

  "武器": {
    "選択武器": {"type":"weapon","name":"ホープボウⅠ","deffence":0,"fire":0,"water":0,"ice":0,"thunder":0,"dragon":0,"slots":[0,0,0],"skills":{},"element":0,"raw":90,"elementType":"none","affinity":0},
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
    "狂竜症克服率": 100,
    "傷あり率": 10,
    "撃ち切るビン数": 10,
    "濡れ刃紋 泡状態率": 90,
    "濡れ刃紋 濡れ状態率": 10,
    "濡れ刃紋 発動なし率": 0,
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

  // 発動条件が厳しいスキルは activeRate の初期値を調整
  const activeRateSettings = {
    "火事場力": 0,
    "フルチャージ": 0,
    "力の解放": 0,
    "挑戦者": 50,
    "攻勢": 0,
    "逆恨み": 0,
    "急襲": 0,
    "渾身": 0,
    "災禍転福": 0,
    "属性変換": 0,
    "逆襲": 0,
  }

  for (let skill in activeRateSettings) {
    skillInputData[skill] = {
      ...skillInputData[skill],
      activeRate: activeRateSettings[skill],
    }
  }

  return skillInputData;
}
