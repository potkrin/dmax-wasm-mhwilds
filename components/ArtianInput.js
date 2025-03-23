import React, { useState, useEffect, useRef } from "react";
import {
  TextField,
  Button,
  Grid,
  Box,
  Card,
  Typography,
  ButtonGroup,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  useMediaQuery,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import AddIcon from "@mui/icons-material/Add";

import { SkillCard } from "./SkillCard";
import { staticSkillData, staticData } from "../data/StaticData";
import { NumberTextField } from "./NumberTextField";

import { commonStyles } from "./DmaxMain";
import SlotLevels from "./SlotLevels";
import { breakpoints } from "../src/theme";

export function GridItemInput(props) {
  return <Grid item xs={6} {...props} />;
}

/**
 * バグ: 選択済みのスキルをもう一度選択したとき追加できない
 * 再現方法: 「攻撃」を選択→「攻撃」を削除→「攻撃」を選択→追加できない
 */

// 列要素対応表
//        0,1,                 2,3,4,5,6
// 火事場力,3,              渾身,2,3,1,1
// 超会心  ,2,              体術,3,3,1,1
// 体術    ,3,通常弾・連射矢強化,2,3,1,1
export function ArtianInput({ userArtianData, setUserArtianData }) {
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

  const [slots, setSlots] = useState([0, 0, 0]);
  useEffect(() => {
    console.log(slots);
  }, [slots]);

  const handleSlotSelect = (index, newLevel) => {
    setSlots((prev) => {
      const newSlots = [...prev];
      newSlots[index] = parseInt(newLevel);
      return newSlots;
    });
  };

  // Autoselect のテキストボックスに入力されている値 (onFocus でリセットするために定義)
  const [currentSkill, setCurrentSkill] = useState(null);

  const [raw, setRaw] = useState(200);
  const [elementType, setElementType] = useState("無属性");
  const [element, setElement] = useState(0);
  const [affinity, setAffinity] = useState(0);

  const handleChangeRaw = (key, event, value) => {
    const raw = parseInt(event.target.value);
    setRaw(raw);
  };

  const handleChangeElement = (key, event, value) => {
    const element = parseInt(event.target.value);
    setElement(element);
  };

  const handleChangeAffinity = (key, event, value) => {
    const affinity = event.target.value;
    setAffinity(affinity);
  };

  const handleChangeElementType = (key, event, value) => {
    setElementType(event.target.value);
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

  // 登録ボタンを追加
  const registerArtian = () => {
    let revisedAffinity = isNaN(affinity) ? 0 : parseInt(affinity);
    if (revisedAffinity > 100) revisedAffinity = 100;
    if (revisedAffinity < -100) revisedAffinity = -100;

    setAffinity(revisedAffinity);

    const tempArtian = {
      "type": "weapon",
      "name": "アーティア",
      "deffence": 0,
      "fire": 0,
      "water": 0,
      "ice": 0,
      "thunder": 0,
      "dragon": 0,
      "skills": {},
      "slots": [...slots.sort().reverse()],
      "element": element,
      "raw": raw,
      "affinity": revisedAffinity,
      "elementType": staticData["武器"]["elementKV"][elementType],
    };

    // make weapon name
    let weaponName = "アーティア (";
    weaponName += raw + ", ";
    weaponName += revisedAffinity + "%, ";
    weaponName += elementType + ", ";
    weaponName += element + ", ";
    weaponName += slots.join("-") + ", ";
    for (const skill of selectedSkills) {
      weaponName += skill.name + skill.level + ", ";
    }
    weaponName = weaponName.slice(0, -2) + ")";
    tempArtian["name"] = weaponName;

    for (const skill of selectedSkills) {
      tempArtian.skills[skill.name] = skill.level;
    }

    console.log(tempArtian);
    setUserArtianData((prev) => [...prev, tempArtian]);
  };

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
      // ArtianInputが表示されているときの処理をここに書く
      if (dummyCardRef.current) {
        const height = dummyCardRef.current.offsetHeight;
        setContainerHeight(height * 2); // 2つ分のSkillCardの高さを確保します。
        console.log("dummyCardRef useEffect: " + height);
      }
    }
  }, [isVisible]);

  const matches = useMediaQuery("(max-width: " + breakpoints.values.sm + "px)"); // 'sm' は600pxに設定されていることが多い

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
            武器データ入力
          </Typography>

          <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <GridItemInput item>
              <NumberTextField
                value={raw}
                size="small"
                id="outlined-basic"
                label={"攻撃力"}
                variant="outlined"
                onChange={(e, v) => handleChangeRaw("raw", e, v)}
                min={0}
                max={1000}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </GridItemInput>

            <GridItemInput item>
              <NumberTextField
                value={affinity}
                size="small"
                id="outlined-basic"
                label={"会心率"}
                variant="outlined"
                onChange={(e, v) => handleChangeAffinity("affinity", e, v)}
                min={-100}
                max={100}
                negativeInteger={true}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </GridItemInput>

            <GridItemInput item>
              <NumberTextField
                value={element}
                size="small"
                id="outlined-basic"
                label={"属性値"}
                variant="outlined"
                onChange={(e, v) => handleChangeElement("element", e, v)}
                min={0}
                max={1000}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </GridItemInput>

            <GridItemInput item>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">{"属性"}</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  size="small"
                  value={elementType}
                  label={"属性"}
                  onChange={(e, v) => handleChangeElementType("属性", e, v)}
                  style={{ textAlign: "left" }}
                  // // MUI の Select コンポーネントはドロップダウンボックスを開いたときにページ全体用のスクロールバーが表示になり
                  // // 全体スクロールがロックされる。このときビューポートの横幅が変わるため、右端を起点に固定している Fab ボタンが
                  // // 左右にズレてしまう

                  // // 以下の追加処理によってドロップダウンボックスの開閉時に Fab ボタンが左右にずれる問題を解決できる
                  // // しかし setFabRight によりボタンの開閉が遅くなるので、現状はコメントアウトし、スクロールバーの非表示で対処
                  // // usememo などによりレンダリングを高速化出来た場合には、この処理を有効にしてみる
                  // onOpen={() => {
                  //   document.body.style.overflow = "hidden";
                  //   document.body.style.paddingRight = `${scrollbarWidth}px`;
                  //   setFabRight(fabRight + scrollbarWidth);
                  // }}
                  // onClose={() => {
                  //   document.body.style.overflow = "";
                  //   document.body.style.paddingRight = "0px";
                  //   setFabRight(fabRight - scrollbarWidth);
                  // }}
                  // MenuProps={{
                  //   disableScrollLock: true,
                  // }}
                >
                  {Object.keys(staticData["武器"]["属性"])
                    .sort((a, b) => {
                      if (a === "なし" || a === "無属性") return -1; // "なし"は常に先頭に
                      if (b === "なし" || b === "無属性") return 1; // "なし"以外は常に"なし"の後ろ
                      return a.localeCompare(b); // それ以外はアルファベット順
                    })
                    .map((key) => (
                      <MenuItem key={key} value={key}>
                        {key}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </GridItemInput>

            <Grid item xs={12}>
              <Autocomplete
                options={suggestions}
                onChange={handleSkillSelect}
                renderInput={(params) => (
                  <TextField {...params} label="スキル" variant="outlined" />
                )}
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
                      onClick={registerArtian}
                      startIcon={<AddIcon />}
                      size={matches ? "small" : "medium"}
                    >
                      追加
                    </Button>
                  </Box>
                </Grid>
              </Grid>
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

export default ArtianInput;
