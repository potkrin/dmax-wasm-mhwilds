import React from "react";
import {
  Typography,
  Grid,
  Box,
  Slider,
  TextField,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
  Divider,
  Paper,
  Tooltip,
  Button,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

import { NumberTextField } from "./NumberTextField";
import { staticData } from "../data/StaticData";

import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import AddIcon from "@mui/icons-material/Add";
import IndeterminateCheckBoxOutlinedIcon from "@mui/icons-material/IndeterminateCheckBoxOutlined";
import RemoveIcon from "@mui/icons-material/Remove";
import { useTheme } from "@mui/material/styles";
import { theme, breakpoints } from "../src/theme";
import { isEqual } from "lodash";

export const Skill = React.memo(
  ({ staticSkillData, setUserInputData, userInputDataSkill, userInputDataOther, onRemove }) => {
    console.log("[dbg] Skill: staticSkillData= ", staticSkillData);
    const handleChangeSkillInfo = (key, event, value) => {
      console.log("[dbg] handleChangeSkillInfo: ", key, event, value);
      if (key === "activeRate" && !value) {
        // TextField から呼び出された場合
        value = parseInt(event.target.value);
      }
      if (key === "fixLevel") {
        // CheckBox から呼び出された場合
        value = event.target.checked;
      }
      setUserInputData((prevData) => ({
        ...prevData,
        "スキル": {
          ...prevData["スキル"],
          [staticSkillData.name]: {
            ...prevData["スキル"][staticSkillData.name],
            [key]: value,
          },
        },
      }));
    };

    const handleChangeOther = (key, event, value) => {
      if (
        (key === "全属性耐性値" ||
          key === "狂竜症" ||
          key === "狂竜症克服率" ||
          key === "傷あり率" ||
          key === "撃ち切るビン数" ||
          key === "濡れ刃紋 泡状態率" ||
          key === "濡れ刃紋 濡れ状態率" ||
          key === "濡れ刃紋 発動なし率" ||
          key === "雷耐性") &&
        !value
      ) {
        // TextField から呼び出された場合
        value = parseInt(event.target.value);
      } else if (key === "黒蝕一体なしの狂竜症発動") {
        // Checkbox から呼び出された場合
        value = event.target.checked;
      } else {
        value = event.target.value;
      }

      setUserInputData((prevData) => ({
        ...prevData,
        "その他": {
          ...prevData["その他"],
          [key]: value,
        },
      }));
    };

    const skillInput = userInputDataSkill;

    const buttonSize = "24px";

    const matches = useMediaQuery("(max-width: " + breakpoints.values.sm + "px)"); // 'sm' は600pxに設定されていることが多い

    // 補足情報を取得する関数
    const getSkillSupplementaryInfo = (skillName) => {
      const supplementaryInfo = {
        "黒蝕竜の力": "狂竜症を克服している時間の割合",
        "弱点特効": "傷あり状態の弱点を攻撃する割合",
        "フォースショット": "1回のリロードで平均して何本目のビンまで撃つか指定してください",
        "耐性変換【雷】": "食事効果も含めた最終的な雷耐性の値を指定してください",
        "濡れ刃紋": "泡・濡れ・発動なしの状態割合",
        "無我の境地":
          "ゴアマガラや狂竜化モンスターの攻撃を受けることで狂竜症を発動させられる場合はONにしてください",
        "海竜の渦雷":
          "貫通ビンの射撃では発動できません。発動率50%以上の運用は難しいと思います。(効果時間が20秒～30秒なのに対してクールタイムが30秒あるため)",
        "刃鱗増装": "刃鱗増装で増えたビンにはフォースショットの効果は乗りません",
      };
      return supplementaryInfo[skillName] || null;
    };

    return (
      <>
        <Grid container mt={0.5} paddingX={!matches ? 1 : 0.5}>
          {/* レベル固定チェックボックス */}
          <Grid
            item
            xs={1}
            md={0.5}
            sx={{ display: "flex", alignItems: "flex-start", justifyContent: "center" }}
          >
            {staticSkillData.type !== "FixedLevelDamage" ? (
              <Checkbox
                checked={skillInput.fixLevel}
                onChange={(e, v) => handleChangeSkillInfo("fixLevel", e, v)}
                size="small"
                sx={{ alignItems: "center", marginTop: -0.8 }}
              />
            ) : (
              <Tooltip title="このスキルは固定レベルしか選択できません" placement="top">
                <div>
                  <Checkbox
                    checked
                    disabled
                    size="small"
                    sx={{ alignItems: "center", marginTop: -0.8 }}
                  />
                </div>
              </Tooltip>
            )}
          </Grid>
          {/* スキル名, スキルレベル, スライダー(md以上の画面のみ)*/}
          <Grid item xs={3.5} md={3.5} lg={3}>
            <Box display="flex" alignItems="center">
              <Typography
                variant="body1"
                sx={{
                  textAlign: "left",
                  display: "flex",
                  alignItems: "flex-start",
                }}
              >
                {staticSkillData.name}
              </Typography>
              {!matches && (
                <Typography
                  variant="body1"
                  sx={{
                    color: theme.vars.palette.secondary.main,
                    textAlign: "left",
                    display: "flex",
                    alignItems: "flex-start",
                    marginLeft: 1,
                  }}
                >
                  {skillInput.minLevel > 0 ? `Lv.${skillInput.minLevel}` : ""}
                </Typography>
              )}
            </Box>
            {!matches ? (
              <Box sx={{ width: 30 * staticSkillData.maxLevel, mt: -1, ml: 0.5 }}>
                <Slider
                  aria-label="Temperature"
                  value={skillInput.minLevel}
                  valueLabelDisplay="auto"
                  step={1}
                  marks={Array.from({ length: staticSkillData.maxLevel + 1 }, (_, level) => ({
                    value: level,
                  }))}
                  min={0}
                  max={staticSkillData.maxLevel}
                  onChange={(e, v) => handleChangeSkillInfo("minLevel", e, v)}
                  size="small"
                  sx={{
                    "& .MuiSlider-mark": {
                      borderRadius: "6px",
                      height: "6px",
                      width: "6px",
                      color:
                        skillInput.minLevel > 0
                          ? theme.vars.palette.primary.main
                          : theme.vars.palette.text.hint,
                      "&.MuiSlider-markActive": {
                        opacity: 1,
                        backgroundColor: "currentColor",
                      },
                    },

                    "& .MuiSlider-rail": {
                      height: "3px",
                      color:
                        skillInput.minLevel > 0
                          ? theme.vars.palette.primary.main
                          : theme.vars.palette.text.hint,
                    },
                    "& .MuiSlider-thumb": {
                      borderRadius: "2px",
                      width: "12px",
                      height: "12px",
                      color:
                        skillInput.minLevel > 0
                          ? theme.vars.palette.primary.main
                          : theme.vars.palette.text.hint,
                    },
                  }}
                />
              </Box>
            ) : (
              <></>
              /* 
            <>
              <IconButton
                onClick={(e, v) =>
                  handleChangeSkillInfo(
                    "minLevel",
                    e,
                    skillInput.minLevel - 1 >= 0 ? skillInput.minLevel - 1 : 0
                  )
                }
                sx={{ marginTop: -1 }}
              >
                <IndeterminateCheckBoxOutlinedIcon
                  sx={{
                    width: buttonSize,
                    height: buttonSize,
                    color: theme.vars.palette.text.secondary,
                  }}
                />
              </IconButton>
              <IconButton
                onClick={(e, v) =>
                  handleChangeSkillInfo(
                    "minLevel",
                    e,
                    skillInput.minLevel + 1 <= staticSkillData.maxLevel
                      ? skillInput.minLevel + 1
                      : staticSkillData.maxLevel
                  )
                }
                sx={{ marginTop: -1, marginLeft: 1 }}
              >
                <AddBoxOutlinedIcon
                  sx={{
                    width: buttonSize,
                    height: buttonSize,
                    color: theme.vars.palette.text.secondary,
                  }}
                />
              </IconButton>
            </> 
            */
            )}
          </Grid>
          {/* ダメージ発動率 (ダメージ寄与スキルのみ) */}
          {matches &&
            (staticSkillData.type === "Damage" || staticSkillData.type === "FixedLevelDamage" ? (
              <>
                <Grid
                  item
                  xs={2}
                  md={1}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Tooltip
                    title={"このスキルの発動率は固定です"}
                    disableTouchListener={staticSkillData.type !== "FixedLevelDamage"}
                    placement="top"
                  >
                    <span>
                      <NumberTextField
                        disabled={staticSkillData.type === "FixedLevelDamage"}
                        value={skillInput.activeRate}
                        size="small"
                        id="outlined-basic"
                        variant="standard"
                        onChange={(e, v) => handleChangeSkillInfo("activeRate", e, v)}
                        min={0}
                        max={100}
                        inputProps={{
                          style: {
                            minWidth: "45px",
                            textAlign: "center",
                          },
                        }}
                        matches={matches}
                      />
                    </span>
                  </Tooltip>
                  {/* <Slider
                  value={skillInput.activeRate}
                  size="small"
                  aria-label="Temperature"
                  valueLabelDisplay="auto"
                  min={0}
                  max={100}
                  sx={{
                    marginTop: "-8px",
                    "& .MuiSlider-rail": {
                      color:
                        skillInput.activeRate > 0
                          ? theme.vars.palette.primary.main
                          : theme.vars.palette.text.disabled,
                    },
                    "& .MuiSlider-thumb": {
                      width: "8px",
                      height: "8px",
                      color:
                        skillInput.activeRate > 0
                          ? theme.vars.palette.primary.main
                          : theme.vars.palette.text.disabled,
                    },
                  }}
                  onChange={(e, v) => handleChangeSkillInfo("activeRate", e, v)}
                /> */}
                </Grid>
              </>
            ) : (
              <></>
            ))}
          {/* レベル変更+/-ボタン (xs画面のみ) */}
          {matches && (
            <Grid
              item
              container
              xs={4}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-start",
              }}
            >
              <Grid item xs={4.5}>
                <IconButton
                  onClick={(e, v) =>
                    handleChangeSkillInfo(
                      "minLevel",
                      e,
                      skillInput.minLevel - 1 >= 0 ? skillInput.minLevel - 1 : 0
                    )
                  }
                  sx={{ marginTop: -1 }}
                >
                  <RemoveIcon
                    sx={{
                      width: buttonSize,
                      height: buttonSize,
                      color: theme.vars.palette.text.secondary,
                    }}
                  />
                  {/* <IndeterminateCheckBoxOutlinedIcon
                  sx={{
                    width: buttonSize,
                    height: buttonSize,
                    color: theme.vars.palette.text.secondary,
                  }}
                /> */}
                </IconButton>
              </Grid>
              <Grid item xs={3} sx={{ display: "flex", justifyContent: "center" }}>
                <Typography
                  variant="body1"
                  sx={{
                    color: theme.vars.palette.secondary.main,
                    textAlign: "left",
                    display: "flex",
                    alignItems: "flex-start",
                    marginLeft: 1,
                  }}
                >
                  {skillInput.minLevel > 0 ? `Lv.${skillInput.minLevel}` : ""}
                </Typography>
              </Grid>
              <Grid item xs={4.5}>
                <IconButton
                  onClick={(e, v) =>
                    handleChangeSkillInfo(
                      "minLevel",
                      e,
                      skillInput.minLevel + 1 <= staticSkillData.maxLevel
                        ? skillInput.minLevel + 1
                        : staticSkillData.maxLevel
                    )
                  }
                  sx={{
                    marginTop: -1,
                    marginLeft: 1,
                  }}
                >
                  <AddIcon
                    sx={{
                      width: buttonSize,
                      height: buttonSize,
                      color: theme.vars.palette.text.secondary,
                    }}
                  />
                  {/* <AddBoxOutlinedIcon
                  sx={{
                    width: buttonSize,
                    height: buttonSize,
                    color: theme.vars.palette.text.secondary,
                  }}
                /> */}
                </IconButton>
              </Grid>
            </Grid>
          )}
          {matches && staticSkillData.type === "NonDamage" && (
            <Grid item xs={2} md={2} sx={{ display: "flex", alignItems: "flex-start" }}>
              {onRemove && (
                <Button onClick={onRemove} sx={{ padding: 0 }}>
                  <ClearIcon />
                </Button>
              )}
            </Grid>
          )}
          {/* md以上の画面のダメージ発動率 (ダメージ寄与スキルのみ) */}
          {!matches &&
            (staticSkillData.type === "Damage" || staticSkillData.type === "FixedLevelDamage" ? (
              <>
                <Grid
                  item
                  xs={2}
                  sm={2}
                  md={2}
                  sx={{ display: "flex", alignItems: "flex-start", justifyContent: "center" }}
                >
                  <Tooltip
                    title={"このスキルの発動率は固定です"}
                    disableHoverListener={staticSkillData.type !== "FixedLevelDamage"}
                    disableFocusListener={staticSkillData.type !== "FixedLevelDamage"}
                    placement="top"
                  >
                    <Box sx={{ maxWidth: "80px" }}>
                      <Box>
                        <NumberTextField
                          disabled={staticSkillData.type === "FixedLevelDamage"}
                          value={skillInput.activeRate}
                          size="small"
                          id="outlined-basic"
                          variant="standard"
                          onChange={(e, v) => handleChangeSkillInfo("activeRate", e, v)}
                          min={0}
                          max={100}
                          inputProps={{
                            style: { textAlign: "center", paddingLeft: "16px" },
                          }}
                          sx={{ marginBottom: -0.5 }}
                        />
                      </Box>
                      <Slider
                        disabled={staticSkillData.type === "FixedLevelDamage"}
                        value={skillInput.activeRate}
                        size="small"
                        aria-label="Temperature"
                        valueLabelDisplay="auto"
                        min={0}
                        max={100}
                        sx={{
                          marginTop: "-8px",
                          "& .MuiSlider-rail": {
                            color:
                              skillInput.activeRate > 0
                                ? theme.vars.palette.primary.main
                                : theme.vars.palette.text.disabled,
                          },
                          "& .MuiSlider-thumb": {
                            width: "8px",
                            height: "8px",
                          },
                        }}
                        onChange={(e, v) => handleChangeSkillInfo("activeRate", e, v)}
                      />
                    </Box>
                  </Tooltip>
                </Grid>
              </>
            ) : (
              <Grid
                item
                xs={4}
                sm={3}
                md={2}
                sx={{ display: "flex", alignItems: "flex-start", justifyContent: "center" }}
              >
                {onRemove && (
                  <Grid item xs={2}>
                    <Button onClick={onRemove}>
                      <ClearIcon />
                    </Button>
                  </Grid>
                )}
              </Grid>
            ))}
          {/* {matches && <Grid item xs={4}></Grid>} */}
          {/* 追加で入力項目が必要なスキルの処理 */}
          {!matches && (
            <Grid
              item
              xs={3}
              sm={2.5}
              md={2}
              sx={{ display: "flex", justifyContent: "center", padding: "0 0.5rem" }}
            >
              {staticSkillData.name === "龍気変換" ? (
                <NumberTextField
                  label="全属性耐性合計"
                  size="small"
                  value={userInputDataOther["全属性耐性値"]}
                  onChange={(e, v) => handleChangeOther("全属性耐性値", e, v)}
                  // onChange={(e, v) => updatePartialUserInputData(e, v, "その他", "全属性耐性値")}
                  min={0}
                  max={250}
                  sx={{ minWidth: "100px" }}
                  fullWidth
                />
              ) : staticSkillData.name === "狂竜症【蝕】" ? (
                <NumberTextField
                  label="狂竜症感染率"
                  size="small"
                  value={userInputDataOther["狂竜症【蝕】感染時割合"]}
                  onChange={(e, v) => handleChangeOther("狂竜症【蝕】感染時割合", e, v)}
                  min={0}
                  max={100}
                  sx={{ minWidth: "100px" }}
                  fullWidth
                />
              ) : staticSkillData.name === "黒蝕竜の力" ? (
                <NumberTextField
                  label="狂竜症克服率"
                  size="small"
                  value={userInputDataOther["狂竜症克服率"]}
                  onChange={(e, v) => handleChangeOther("狂竜症克服率", e, v)}
                  min={0}
                  max={100}
                  sx={{ minWidth: "100px" }}
                  fullWidth
                />
              ) : staticSkillData.name === "弱点特効" ? (
                <NumberTextField
                  label="傷あり率"
                  size="small"
                  value={userInputDataOther["傷あり率"]}
                  onChange={(e, v) => handleChangeOther("傷あり率", e, v)}
                  min={0}
                  max={100}
                  sx={{ minWidth: "100px" }}
                  fullWidth
                />
              ) : staticSkillData.name === "フォースショット" ? (
                <NumberTextField
                  label="撃ち切るビン数"
                  size="small"
                  value={userInputDataOther["撃ち切るビン数"]}
                  onChange={(e, v) => handleChangeOther("撃ち切るビン数", e, v)}
                  min={0}
                  max={10}
                  sx={{ minWidth: "100px" }}
                  fullWidth
                />
              ) : staticSkillData.name === "耐性変換【雷】" ? (
                <NumberTextField
                  label="雷耐性"
                  size="small"
                  value={userInputDataOther["雷耐性"]}
                  onChange={(e, v) => handleChangeOther("雷耐性", e, v)}
                  min={0}
                  max={50}
                  sx={{ minWidth: "100px" }}
                  fullWidth
                />
              ) : staticSkillData.name === "濡れ刃紋" ? (
                <NumberTextField
                  label="濡れ刃紋 泡状態率"
                  size="small"
                  value={userInputDataOther["濡れ刃紋 泡状態率"]}
                  onChange={(e, v) => handleChangeOther("濡れ刃紋 泡状態率", e, v)}
                  min={0}
                  max={100}
                  sx={{ minWidth: "100px" }}
                  fullWidth
                />
              ) : staticSkillData.name === "伏魔響命" ? (
                <FormControl sx={{ minWidth: "100px" }} fullWidth>
                  <InputLabel id="demo-simple-select-label">キュリア</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    size="small"
                    value={userInputDataOther["キュリア"]}
                    label={"キュリア"}
                    onChange={(e) => handleChangeOther("キュリア", e)}
                    sx={{ ...(matches && { maxHeight: "30px" }) }}
                  >
                    {Object.entries(staticData["その他"]["キュリア"]).map(([key, value]) => (
                      <MenuItem key={key} value={value}>
                        {value}匹
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : staticSkillData.name === "血氣覚醒" ? (
                <FormControl sx={{ minWidth: "100px" }} fullWidth>
                  <InputLabel id="demo-simple-select-label">血氣覚醒</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    size="small"
                    value={userInputDataOther["血氣覚醒"]}
                    label={"血氣覚醒"}
                    onChange={(e) => handleChangeOther("血氣覚醒", e)}
                  >
                    {Object.entries(staticData["その他"]["血氣覚醒"]).map(([key, value]) => (
                      <MenuItem key={key} value={value}>
                        {value}段階目
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : staticSkillData.name === "無我の境地" ? (
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={userInputDataOther["黒蝕一体なしの狂竜症発動"]}
                        onChange={(e) => handleChangeOther("黒蝕一体なしの狂竜症発動", e)}
                        size="small"
                      />
                    }
                    label={
                      <Typography variant="caption" sx={{ fontSize: "0.75rem" }}>
                        黒蝕一体なしで狂竜症発動
                      </Typography>
                    }
                    sx={{
                      margin: 0,
                      padding: "4px 8px 4px 0px",
                      borderRadius: 1,
                      cursor: "pointer",
                      userSelect: "none",
                      "&:hover": {
                        backgroundColor: theme.vars.palette.action.hover,
                      },
                      "& .MuiFormControlLabel-label": {
                        userSelect: "none",
                      },
                    }}
                  />
                </FormGroup>
              ) : (
                <></>
              )}
            </Grid>
          )}

          {/* 補足情報表示 (追加項目が必要なスキルのみ) */}
          {!matches && getSkillSupplementaryInfo(staticSkillData.name) && (
            <Grid
              item
              xs={3}
              sm={3}
              md={3}
              sx={{
                display: "flex",
                justifyContent: "left",
                alignItems: "center",
                padding: "0.2rem 0.5rem",
              }}
            >
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{
                  textAlign: "left",
                  fontSize: "0.75rem",
                  lineHeight: 1.2,
                }}
              >
                {getSkillSupplementaryInfo(staticSkillData.name)}
              </Typography>
            </Grid>
          )}

          {/* 濡れ刃紋 */}
          {!matches && staticSkillData.name === "濡れ刃紋" && (
            <>
              <Grid item sm={6.5} md={6} lg={5.5}></Grid>

              <Grid
                item
                xs={3}
                sm={2.5}
                md={2}
                sx={{
                  display: "flex",
                  justifyContent: "end",
                  paddingX: "0.5rem",
                  paddingTop: "0.1rem",
                  paddingBottom: "0.8rem",
                }}
              >
                <NumberTextField
                  label="濡れ刃紋 濡れ状態率"
                  size="small"
                  value={userInputDataOther["濡れ刃紋 濡れ状態率"]}
                  onChange={(e, v) => handleChangeOther("濡れ刃紋 濡れ状態率", e, v)}
                  min={0}
                  max={100}
                  sx={{ minWidth: "100px" }}
                  fullWidth
                />
              </Grid>

              <Grid item sm={6.5} md={6} lg={5.5}></Grid>
              <Grid
                item
                xs={3}
                sm={2.5}
                md={2}
                sx={{
                  paddingX: "0.5rem",
                  paddingBottom: "1.5rem",
                }}
              >
                <NumberTextField
                  label="濡れ刃紋 発動なし率"
                  size="small"
                  value={userInputDataOther["濡れ刃紋 発動なし率"]}
                  onChange={(e, v) => handleChangeOther("濡れ刃紋 発動なし率", e, v)}
                  min={0}
                  max={100}
                  sx={{ minWidth: "100px" }}
                  fullWidth
                />
                {userInputDataOther["濡れ刃紋 濡れ状態率"] +
                  userInputDataOther["濡れ刃紋 発動なし率"] +
                  userInputDataOther["濡れ刃紋 泡状態率"] !==
                  100 && (
                  <>
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ marginLeft: 1, marginTop: 1 }}
                    >
                      {"合計100%にしてください"}{" "}
                    </Typography>
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ marginLeft: 1, marginTop: 0 }}
                    >
                      {"(現在: " +
                        (userInputDataOther["濡れ刃紋 濡れ状態率"] +
                          userInputDataOther["濡れ刃紋 発動なし率"] +
                          userInputDataOther["濡れ刃紋 泡状態率"]) +
                        "%)"}
                    </Typography>
                  </>
                )}
              </Grid>
            </>
          )}
        </Grid>
      </>
    );
  },

  (prevProps, nextProps) => {
    // カスタム比較ロジック
    // true: 一致とみなし再レンダリングしない
    // false: 不一致とみなし再レンダリングする
    const skillName = prevProps.staticSkillData.name;
    const base =
      isEqual(prevProps.staticSkillData, nextProps.staticSkillData) &&
      isEqual(prevProps.userInputDataSkill, nextProps.userInputDataSkill) &&
      isEqual(prevProps.onRemove, nextProps.onRemove);
    // other を含むスキルは追加で userOtherInputData の変更をチェック
    if (skillName === "龍気変換") {
      return (
        base &&
        prevProps.userInputDataOther["全属性耐性値"] ===
          nextProps.userInputDataOther["全属性耐性値"]
      );
    } else if (skillName === "狂竜症【蝕】") {
      return (
        base &&
        prevProps.userInputDataOther["狂竜症【蝕】感染時割合"] ===
          nextProps.userInputDataOther["狂竜症【蝕】感染時割合"]
      );
    } else if (skillName === "黒蝕竜の力") {
      return (
        base &&
        prevProps.userInputDataOther["狂竜症克服率"] ===
          nextProps.userInputDataOther["狂竜症克服率"]
      );
    } else if (skillName === "弱点特効") {
      return (
        base &&
        prevProps.userInputDataOther["傷あり率"] === nextProps.userInputDataOther["傷あり率"]
      );
    } else if (skillName === "フォースショット") {
      return (
        base &&
        prevProps.userInputDataOther["撃ち切るビン数"] ===
          nextProps.userInputDataOther["撃ち切るビン数"]
      );
    } else if (skillName === "耐性変換【雷】") {
      return (
        base && prevProps.userInputDataOther["雷耐性"] === nextProps.userInputDataOther["雷耐性"]
      );
    } else if (skillName === "濡れ刃紋") {
      return (
        base &&
        prevProps.userInputDataOther["濡れ刃紋 泡状態率"] ===
          nextProps.userInputDataOther["濡れ刃紋 泡状態率"] &&
        prevProps.userInputDataOther["濡れ刃紋 濡れ状態率"] ===
          nextProps.userInputDataOther["濡れ刃紋 濡れ状態率"] &&
        prevProps.userInputDataOther["濡れ刃紋 発動なし率"] ===
          nextProps.userInputDataOther["濡れ刃紋 発動なし率"]
      );
    } else if (skillName === "伏魔響命") {
      return (
        base &&
        prevProps.userInputDataOther["キュリア"] === nextProps.userInputDataOther["キュリア"]
      );
    } else if (skillName === "血氣覚醒") {
      return (
        base &&
        prevProps.userInputDataOther["血氣覚醒"] === nextProps.userInputDataOther["血氣覚醒"]
      );
    } else if (skillName === "無我の境地") {
      return (
        base &&
        prevProps.userInputDataOther["黒蝕一体なしの狂竜症発動"] ===
          nextProps.userInputDataOther["黒蝕一体なしの狂竜症発動"]
      );
    } else {
      // other がないスキルの場合 staticSkillData と userInputDataSkill のみをチェック
      return base;
    }
  }
);

export default Skill;
