// 複数のファイルで利用する関数を定義する

export function applyWaterBlight(hitzone, waterBlightVal) {
  console.log("hitzone:", hitzone, "waterblight:", waterBlightVal);
  if (waterBlightVal === false) {
    return hitzone;
  }

  if (hitzone <= 60) {
    return Math.floor((60 - hitzone) * 0.37 + hitzone + 3);
  } else {
    return hitzone + 3;
  }
}
