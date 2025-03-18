import React, { useState, useEffect, useRef } from "react";
import { TextField, Button, Box, Card, Typography, Grid } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import AddIcon from "@mui/icons-material/Add";

import { SkillCard } from "./SkillCard";
import { staticSkillData } from "../data/StaticData";
import { commonStyles } from "./DmaxMain";

import { armorDict } from "../data/EquipData";
import SlotLevels from "./SlotLevels";

// 列要素対応表
// 0           ,  1,2,3,4, 5,6,7,8,9,  10,11,      12,13,14,15,16,17,18,19
// ゼクスヘルム,-11,0,0,0,-3,0,0,0,0,攻撃, 2,気絶耐性,-1,  ,  ,  ,  ,  ,
export function QuriousArmorInput({ userQuriousArmorData, setUserQuriousArmorData }) {
  const [armorSuggestions, setArmorSuggestions] = useState(Object.keys(armorDict));
  const [skillSuggestions, setSkillSuggestions] = useState(Object.keys(staticSkillData));

  // Autoselect から追加されたスキル
  const [selectedSkills, setSelectedSkills] = useState([]);

  // Autoselect のテキストボックスに入力されている値 (onFocus でリセットするために定義)
  const [currentSkill, setCurrentSkill] = useState(null);

  const handleSkillSelect = (event, newValue) => {
    setCurrentSkill(newValue);
    if (newValue === null) return;

    // スキルの種類は合計で5つまで (防具付属のスキル + 傀異錬成による追加スキル) <= 5
    if (selectedSkills.length + Object.keys(selectedArmor["skills"]).length >= 5) return;

    // すでに追加済みのスキルは追加しない
    if (selectedSkills.some((skill) => skill.name === newValue)) return;

    // 防具付属のスキルは追加しない
    if (newValue in selectedArmor["skills"]) return;

    setSelectedSkills((prev) => [...prev, { name: newValue, level: 1 }]);
  };

  const handleSkillRemove = (indexToRemove) => {
    setSelectedSkills((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const [selectedArmor, setSelectedArmor] = useState(null);

  const handleArmorSelect = (event, newValue) => {
    // 防具を選択したら現在のスキル入力用の項目をリセットする
    setSelectedSkills([]);

    if (newValue in armorDict) {
      setSelectedArmor(armorDict[newValue]);
      const tempSlots = JSON.parse(JSON.stringify(armorDict[newValue]["slots"]));
      while (tempSlots.length < 3) {
        tempSlots.push(0);
      }
      setSlots(tempSlots);
    }
  };

  const [slots, setSlots] = useState([0, 0, 0]);

  const handleSlotSelect = (index, newLevel) => {
    setSlots((prev) => {
      const newSlots = [...prev];
      newSlots[index] = parseInt(newLevel);
      return newSlots;
    });
  };

  useEffect(() => {
    console.log("useEffect on slots = " + slots);
    setFirstSlotLevel(slots[0]);
    setSecondSlotLevel(slots[1]);
    setThirdSlotLevel(slots[2]);
  }, slots);

  // 登録ボタンを追加
  const registerQuriousArmor = () => {
    // 登録する新しい傀異錬成防具データ
    if (!selectedArmor) return;

    const tempQuriousArmor = JSON.parse(JSON.stringify(selectedArmor));
    tempQuriousArmor["originalArmorName"] = selectedArmor["name"];

    // 傀異錬成元の防具
    const baseArmor = armorDict[selectedArmor["name"]];
    tempQuriousArmor["slots"] = [...slots.sort().reverse()];
    tempQuriousArmor["skills"] = { ...selectedArmor["skills"] };
    for (const skill of selectedSkills) tempQuriousArmor["skills"][skill.name] = skill.level;

    // 防具名はスキルとスロットの差分
    let name = selectedArmor["name"];
    name += " (";
    for (let skill in tempQuriousArmor["skills"]) {
      if (skill in baseArmor["skills"]) {
        let diffLevel = tempQuriousArmor["skills"][skill] - baseArmor["skills"][skill];
        if (diffLevel > 0) name += skill + "+" + diffLevel + ",";
        else if (diffLevel < 0) name += skill + diffLevel + ",";
      } else {
        name += skill + "+" + tempQuriousArmor["skills"][skill] + ",";
      }
    }

    const diffSlots =
      tempQuriousArmor["slots"].reduce((total, slot) => total + slot, 0) -
      baseArmor["slots"].reduce((total, slot) => total + slot, 0);

    if (diffSlots > 0) name += "スロット" + "+" + diffSlots;
    else if (diffSlots < 0) name += "スロット" + diffSlots;

    name += ")";
    tempQuriousArmor["name"] = name;

    setUserQuriousArmorData((prev) => [...prev, tempQuriousArmor]);
  };

  const handleInnateSkill = (skillName, skillLevel) => {
    setSelectedArmor((prev) => {
      const newArmor = JSON.parse(JSON.stringify(prev));
      newArmor.skills[skillName] = skillLevel;
      return newArmor;
    });
  };

  const [firstSlotLevel, setFirstSlotLevel] = useState(0);
  const [secondSlotLevel, setSecondSlotLevel] = useState(0);
  const [thirdSlotLevel, setThirdSlotLevel] = useState(0);

  useEffect(() => {
    setSlots([firstSlotLevel, secondSlotLevel, thirdSlotLevel]);
  }, [firstSlotLevel, secondSlotLevel, thirdSlotLevel]);

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
      if (dummyCardRef.current) {
        const height = dummyCardRef.current.offsetHeight;
        setContainerHeight(height * 5.7);
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
            傀異錬成防具入力
          </Typography>
          <Autocomplete
            options={armorSuggestions}
            onChange={handleArmorSelect}
            renderInput={(params) => <TextField {...params} label="防具" variant="outlined" />}
            sx={{ marginBottom: 2 }}
            size="small"
          />
          {/* 動的に高さを設定 */}
          <div style={{ minHeight: `${containerHeight}px` }}>
            {" "}
            {selectedArmor &&
              Object.entries(selectedArmor["skills"]).map(([skill, level], index) => (
                <SkillCard
                  key={skill}
                  skill={{ "name": skill, "level": level }}
                  setSelectedSkills={setSelectedSkills}
                  handleInnateSkill={handleInnateSkill}
                  onRemove={() => handleSkillRemove(0)}
                  allowRemove={false}
                  noDivider={index === Object.keys(selectedArmor["skills"]).length - 1}
                />
              ))}
            {selectedArmor && (
              <Autocomplete
                options={skillSuggestions}
                onChange={handleSkillSelect}
                renderInput={(params) => (
                  <TextField {...params} label="スキル" variant="outlined" />
                )}
                value={currentSkill}
                onFocus={() => {
                  // 同じスキルを選択肢した場合に追加できない問題を回避するために, 選択肢をリセットする
                  // [[Autocomplete] onChange not fired for same item consecutively #29159](https://github.com/mui/material-ui/issues/29159)
                  setCurrentSkill("");
                }}
                size="small"
                sx={{ marginBottom: 2 }}
              />
            )}
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
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <SlotLevels slotLevel={firstSlotLevel} setSlotLevel={setFirstSlotLevel} />
                </Grid>
                <Grid item xs={12}>
                  <SlotLevels slotLevel={secondSlotLevel} setSlotLevel={setSecondSlotLevel} />
                </Grid>
                <Grid item xs={12}>
                  <SlotLevels slotLevel={thirdSlotLevel} setSlotLevel={setThirdSlotLevel} />
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
                  onClick={registerQuriousArmor}
                  startIcon={<AddIcon />}
                >
                  追加
                </Button>
              </Box>
            </Grid>
          </Grid>
          {/* /*{" "}
          <>
            <div>
              <SlotSelect
                value={slots[0]}
                onChange={(event) => handleSlotSelect(0, event.target.value)}
              />
            </div>
            <div>
              <SlotSelect
                value={slots[1]}
                onChange={(event) => handleSlotSelect(1, event.target.value)}
              />
            </div>
            <div>
              <SlotSelect
                value={slots[2]}
                onChange={(event) => handleSlotSelect(2, event.target.value)}
              />
            </div>
          </>{" "}
          */}
        </Card>
        {/* ダミーのSkillCard。これは画面上には表示されません。 */}
        <div
          ref={dummyCardRef}
          style={{
            visibility: "hidden",
            position: "absolute",
            zIndex: "-1",
            height: "auto",
            width: "50%" /* この幅は実際のSkillCardの幅に依存します */,
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

export default QuriousArmorInput;
