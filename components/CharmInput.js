import React, { useState, useEffect, useRef } from "react";
import { TextField, Button, Grid, Box, Card, Typography, ButtonGroup } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import AddIcon from "@mui/icons-material/Add";

import { SkillCard } from "./SkillCard";
import { staticSkillData } from "../data/StaticData";

import { commonStyles } from "./DmaxMain";
import SlotLevels from "./SlotLevels";

/**
 * バグ: 選択済みのスキルをもう一度選択したとき追加できない
 * 再現方法: 「攻撃」を選択→「攻撃」を削除→「攻撃」を選択→追加できない
 */

// 列要素対応表
//        0,1,                 2,3,4,5,6
// 火事場力,3,              渾身,2,3,1,1
// 超会心  ,2,              体術,3,3,1,1
// 体術    ,3,通常弾・連射矢強化,2,3,1,1
export function CharmInput({ userCharmData, setUserCharmData }) {
  const [suggestions, setSuggestions] = useState(Object.keys(staticSkillData));

  const [selectedSkills, setSelectedSkills] = useState([]);

  const handleSkillSelect = (event, newValue) => {
    setCurrentSkill(newValue);
    if (newValue === null) return;

    if (selectedSkills.length < 3 && !selectedSkills.some((skill) => skill.name === newValue)) {
      setSelectedSkills((prev) => [...prev, { name: newValue, level: 1 }]);
    }
  };

  const handleSkillRemove = (indexToRemove) => {
    setSelectedSkills((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const [armorDecoSlots, setArmorDecoSlots] = useState([0, 0, 0]);
  const [weaponDecoSlots, setWeaponDecoSlots] = useState([0, 0, 0]);

  // 登録ボタンを追加
  const registerCharm = () => {
    // 空の護石を登録しない
    let hasArmorDecoSlot = false;
    let hasWeaponDecoSlot = false;
    for (const slot of armorDecoSlots) if (slot !== 0) hasArmorDecoSlot = true;
    for (const slot of weaponDecoSlots) if (slot !== 0) hasWeaponDecoSlot = true;

    if (selectedSkills.length === 0 && !hasArmorDecoSlot && !hasWeaponDecoSlot) return;

    const tempCharm = {
      "rare": 0,
      "type": "charm",
      "deffence": 0,
      "fire": "0",
      "water": "0",
      "ice": "0",
      "thunder": "0",
      "dragon": "0",
      "skills": {},
      "armorDecoSlots": [...armorDecoSlots.sort().reverse()],
      "weaponDecoSlots": [...weaponDecoSlots.sort().reverse()],
      // 護石【攻撃2, 連撃2】4-1-1_0-0-0 形式で名前を作成
    };
    for (const skill of selectedSkills) {
      tempCharm.skills[skill.name] = skill.level;
    }
    let name = "護石【";
    for (const [index, skill] of selectedSkills.entries()) {
      if (index !== 0) name += ", ";
      name += skill.name + skill.level;
    }
    name += "】武器" + weaponDecoSlots.join("-") + " 防具" + armorDecoSlots.join("-");
    tempCharm.name = name;
    console.log(tempCharm);
    setUserCharmData((prev) => [...prev, tempCharm]);
  };

  // Autoselect のテキストボックスに入力されている値 (onFocus でリセットするために定義)
  const [currentSkill, setCurrentSkill] = useState(null);

  const [firstArmorDecoSlotLevel, setFirstArmorDecoSlotLevel] = useState(0);
  const [secondArmorDecoSlotLevel, setSecondArmorDecoSlotLevel] = useState(0);
  const [thirdArmorDecoSlotLevel, setThirdArmorDecoSlotLevel] = useState(0);
  const [firstWeaponDecoSlotLevel, setFirstWeaponDecoSlotLevel] = useState(0);
  const [secondWeaponDecoSlotLevel, setSecondWeaponDecoSlotLevel] = useState(0);
  const [thirdWeaponDecoSlotLevel, setThirdWeaponDecoSlotLevel] = useState(0);

  useEffect(() => {
    setArmorDecoSlots([firstArmorDecoSlotLevel, secondArmorDecoSlotLevel, thirdArmorDecoSlotLevel]);
  }, [firstArmorDecoSlotLevel, secondArmorDecoSlotLevel, thirdArmorDecoSlotLevel]);

  useEffect(() => {
    setWeaponDecoSlots([
      firstWeaponDecoSlotLevel,
      secondWeaponDecoSlotLevel,
      thirdWeaponDecoSlotLevel,
    ]);
  }, [firstWeaponDecoSlotLevel, secondWeaponDecoSlotLevel, thirdWeaponDecoSlotLevel]);

  // 画面上に表示されているかどうかを判定し、表示されている場合は高さを計算する
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // isVisibleを更新する
        setIsVisible(entry.isIntersecting);
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  // 高さはダミーのSkillCardの高さを基にして計算
  const [containerHeight, setContainerHeight] = useState(0);
  const dummyCardRef = useRef(null); // ダミーのSkillCard用のref

  useEffect(() => {
    if (isVisible) {
      // CharmInputが表示されているときの処理をここに書く
      if (dummyCardRef.current) {
        const height = dummyCardRef.current.offsetHeight;
        setContainerHeight(height * 2); // 2つ分のSkillCardの高さを確保します。
        console.log("dummyCardRef useEffect: " + height);
      }
    }
  }, [isVisible]);

  return (
    <>
      <Box ref={ref}>
        <Card
          variant="outlined"
          sx={{
            borderRadius: 1,
            padding: "20px",
          }}
        >
          <Typography
            variant="subtitle2"
            gutterBottom
            align="left"
            marginBottom={2}
            sx={commonStyles.customHeaderNoMargin}
          >
            護石入力
          </Typography>

          <Autocomplete
            options={suggestions}
            onChange={handleSkillSelect}
            renderInput={(params) => <TextField {...params} label="スキル" variant="outlined" />}
            sx={{ marginBottom: 2 }}
            size="small"
            value={currentSkill}
            onFocus={() => {
              // 同じスキルを選択肢した場合に追加できない問題を回避するために, 選択肢をリセットする
              // [[Autocomplete] onChange not fired for same item consecutively #29159](https://github.com/mui/material-ui/issues/29159)
              setCurrentSkill("");
            }}
          />
          <div style={{ minHeight: `${containerHeight}px` }}>
            {" "}
            {/* 動的に設定された高さ */}
            {selectedSkills.map((skill, index) => (
              <SkillCard
                key={index}
                skill={skill}
                setSelectedSkills={setSelectedSkills}
                onRemove={() => handleSkillRemove(index)}
                allowRemove={true}
              />
            ))}
          </div>
          <Grid container sx={{ marginTop: 4 }}>
            <Grid item xs={9}>
              <Typography variant="subtitle2" gutterBottom sx={{ mb: 1 }}>
                武器装飾品スロット
              </Typography>
              <Grid container spacing={1} sx={{ mb: 2 }}>
                <Grid item xs={12}>
                  <SlotLevels
                    slotLevel={firstWeaponDecoSlotLevel}
                    setSlotLevel={setFirstWeaponDecoSlotLevel}
                    maxLevel={3}
                  />
                </Grid>
                <Grid item xs={12}>
                  <SlotLevels
                    slotLevel={secondWeaponDecoSlotLevel}
                    setSlotLevel={setSecondWeaponDecoSlotLevel}
                    maxLevel={3}
                  />
                </Grid>
                <Grid item xs={12}>
                  <SlotLevels
                    slotLevel={thirdWeaponDecoSlotLevel}
                    setSlotLevel={setThirdWeaponDecoSlotLevel}
                    maxLevel={3}
                  />
                </Grid>
              </Grid>
              <Typography variant="subtitle2" gutterBottom sx={{ mb: 1 }}>
                防具装飾品スロット
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <SlotLevels
                    slotLevel={firstArmorDecoSlotLevel}
                    setSlotLevel={setFirstArmorDecoSlotLevel}
                    maxLevel={3}
                  />
                </Grid>
                <Grid item xs={12}>
                  <SlotLevels
                    slotLevel={secondArmorDecoSlotLevel}
                    setSlotLevel={setSecondArmorDecoSlotLevel}
                    maxLevel={3}
                  />
                </Grid>
                <Grid item xs={12}>
                  <SlotLevels
                    slotLevel={thirdArmorDecoSlotLevel}
                    setSlotLevel={setThirdArmorDecoSlotLevel}
                    maxLevel={3}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* ボタンを右下に寄せる */}
            <Grid item xs={3} container justifyContent="flex-end">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  onClick={registerCharm}
                  startIcon={<AddIcon />}
                >
                  追加
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Card>
        {/* ダミーのSkillCard。これは画面上には表示されません。 */}
        <div
          ref={dummyCardRef}
          style={{
            visibility: "hidden",
            position: "absolute",
            zIndex: "-1",
            height: "auto",
            width: "50%",
          }}
        >
          <SkillCard
            key={0}
            skill={{ "name": "攻撃" }}
            setSelectedSkills={setSelectedSkills}
            onRemove={() => handleSkillRemove(0)}
            allowRemove={true}
          />
        </div>
      </Box>
    </>
  );
}

export default CharmInput;
