import React, { useEffect } from "react";
import { useState } from "react";
import {
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Autocomplete,
  TextField,
  useMediaQuery,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";

import CloudIcon from "@mui/icons-material/Cloud";
import DevicesIcon from "@mui/icons-material/Devices";

import { staticData } from "../data/StaticData";
import { weaponList } from "../data/EquipData";
import { breakpoints } from "../src/theme";

import { has, isEqual, set } from "lodash";

import { fetchWithRetry } from "../lib/utils";
import { useSnackbar } from "./SnackbarContext";
import { useArtianContext } from "./ArtianContext";
import { useLoginContext } from "./LoginContext";
import { katakanaToHiragana } from "./HelperFunction";

const numberFieldKeys = ["攻撃力", "会心率", "属性値"];

// // ドロップダウンボックスの開閉時にFabがずれる問題対処用 (詳細は下の <Select> のコメントを参照)
// function getScrollbarWidth() {
//   // 一時的な要素を作成して、スクロールバーの幅を計算
//   const outer = document.createElement("div");
//   outer.style.visibility = "hidden";
//   outer.style.overflow = "scroll"; // スクロールバーを強制的に表示
//   document.body.appendChild(outer);

//   const inner = document.createElement("div");
//   outer.appendChild(inner);

//   const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;

//   // 作成した要素を削除
//   outer.parentNode.removeChild(outer);

//   console.log("scrollbarWidth", scrollbarWidth);
//   return scrollbarWidth;
// }

export const WeaponSetting = React.memo(
  ({
    userInputDataWeapon,
    updateUserInputData,
    // fabRight,
    // setFabRight,
  }) => {
    // const classes = useStyles();
    const classes = {};
    const handleChangeUserInputData = (key, event, value) => {
      if (key in numberFieldKeys) {
        value = parseInt(event.target.value);
      } else {
        value = event.target.value;
      }
      updateUserInputData("武器", { ...userInputDataWeapon, [key]: value });
    };

    // const scrollbarWidth = getScrollbarWidth();

    const updateWeaponSuggestions = () => {
      let userArtianData = [];
      if (useServerData) {
        userArtianData = serverArtianData;
        if (!userArtianData) userArtianData = [];
      } else {
        userArtianData = JSON.parse(localStorage.getItem("userArtianData"));
        if (!userArtianData) userArtianData = [];
      }

      const weaponListWithArtian = [...userArtianData, ...weaponList];

      setWeaponSuggestions(
        weaponListWithArtian.map((weapon) => {
          if (weapon.name.includes("アーティア")) {
            return weapon.name;
          } else {
            const elementType = Object.entries(staticData["武器"]["elementKV"]).find(
              ([_, value]) => value === weapon.elementType
            )[0];

            let weaponInfo = weapon.name + " (" + weapon.raw + ", " + weapon.affinity + "%)";

            if (elementType !== "無属性") {
              weaponInfo = weaponInfo.slice(0, -1);
              weaponInfo += `, ${elementType}${weapon.element})`;
            }
            return weaponInfo;
          }
        })
      );
    };

    const [weaponSuggestions, setWeaponSuggestions] = useState([]);

    const currentWeapon = userInputDataWeapon["選択武器"]?.name || "";

    const handleWeaponSelect = (event, newValue) => {
      // find weapon info from weaponList
      let userArtianData = [];
      if (useServerData) {
        userArtianData = serverArtianData;
        if (!userArtianData) userArtianData = [];
      } else {
        userArtianData = JSON.parse(localStorage.getItem("userArtianData"));
        if (!userArtianData) userArtianData = [];
      }
      const weaponListWithArtian = [...userArtianData, ...weaponList];

      const selectedWeaponInfo = weaponListWithArtian.find((weapon) => {
        if (newValue?.includes("アーティア") || false) {
          return weapon.name === newValue;
        } else if (newValue) {
          return weapon.name === newValue.split(" (")[0];
        } else {
          return false;
        }
      });

      console.log("[dbg] selectedWeaponInfo", selectedWeaponInfo);

      // set weapon info to state: userInputData
      updateUserInputData("武器", { ...userInputDataWeapon, "選択武器": selectedWeaponInfo });
    };

    const matches = useMediaQuery("(max-width: " + breakpoints.values.md + "px)"); // 'sm' は600pxに設定されていることが多い

    // サーバデータ対応
    const { useServerData, setUseServerData } = useArtianContext();
    const { isLoggedIn, setIsLoggedIn, isDialogOpen, handleCloseDialog, checkLoginStatus } =
      useLoginContext();
    const { error, setError, open, setOpen, handleClose } = useSnackbar();

    // サーバから取得したユーザの武器データ
    const [serverArtianData, setServerArtianData] = useState([]);

    // ToggleButtonGroup の選択により、サーバデータを利用するかローカルストレージデータを利用するかを切り替える
    const handleUserDataLocation = (event, newUserDataLocation) => {
      // save to context
      setUseServerData(newUserDataLocation === "server");
      // save to localstorage
      localStorage.setItem("useServerData", newUserDataLocation === "server");
      // ログイン状態を確認 & ダイアログを表示
      if (newUserDataLocation === "server") {
        checkLoginStatus();
      }
    };

    // useServerData === true の場合、サーバーからデータを取得する
    useEffect(() => {
      if (useServerData) {
        fetchUserArtianData();
      }
    }, [useServerData]);

    useEffect(() => {
      updateWeaponSuggestions();
    }, [serverArtianData]);

    // サーバーから武器データを取得する処理
    const fetchUserArtianData = () => {
      console.log("ServerArtianManager: fetch artiandata from server");

      // ログイン状態を確認した後に artiandata の取得する処理を一連の Promise で定義 (分離すると非同期に処理されてしまうため)
      fetchWithRetry(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/dmax-api/v1/check-login/`,
        {
          method: "GET",
          credentials: "include", // クッキーベースの認証に必要
        },
        3,
        5000
      )
        .then((response) => {
          console.log(`Response Status Code: ${response.status}`); // ステータスコードを表示
          if (response.status === 401) {
            setIsLoggedIn(false);
          } else if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          return response.json();
        })
        .then((data) => {
          if ("is_logged_in" in data && data["is_logged_in"] === true) {
            setIsLoggedIn(true);
            // ログイン中なので artiandata を取得する
            fetchWithRetry(
              `${process.env.NEXT_PUBLIC_API_BASE_URL}/dmax-api/v1/user-equip-data-mhwilds/?equip_type=artianweapon`,
              {
                method: "GET",
                credentials: "include", // クッキーベースの認証に必要
              },
              3,
              5000
            )
              .then((response) => {
                console.log(`Response Status Code: ${response.status}`); // ステータスコードを表示
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                return response.json();
              })
              .then((data) => {
                if (!Array.isArray(data)) {
                  throw new Error(`response data is invalid! data: ${data}`);
                } else if (data.length === 0) {
                  console.log("no record found in server DB");
                } else {
                  console.log("fetch sucess: server_artiandata" + JSON.stringify(data));
                  setServerArtianData(data[0].equip_data);
                }
                // setIsArtianDataFetched(true);
              })
              .catch((error) => {
                console.error("Error:", error);
                console.error("サーバーとの通信でエラーが発生しました\n" + error.stack);
                setError("サーバーから護石データを取得できませんでした");
                setOpen(true);
              });
          } else {
            setIsLoggedIn(false);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          console.error("サーバーとの通信でエラーが発生しました\n" + error.stack);
          setError("ログイン状態の確認に失敗しました");
          setIsLoggedIn(false);
          setOpen(true);
        });
    };

    return (
      <>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Grid container rowSpacing={2} columnSpacing={2} paddingLeft={3} paddingRight={1}>
            <Grid item xs={12} sm={12} md={8} lg={8}>
              <Autocomplete
                options={weaponSuggestions}
                onOpen={fetchUserArtianData}
                onChange={handleWeaponSelect}
                filterOptions={(options, state) =>
                  options.filter((option) =>
                    katakanaToHiragana(option).includes(katakanaToHiragana(state.inputValue))
                  )
                }
                renderInput={(params) => (
                  <TextField {...params} label="武器名" variant="outlined" />
                )}
                size="small"
                value={currentWeapon}
                onFocus={() => {
                  // 同じスキルを選択肢した場合に追加できない問題を回避するために, 選択肢をリセットする
                  // [[Autocomplete] onChange not fired for same item consecutively #29159](https://github.com/mui/material-ui/issues/29159)
                  updateWeaponSuggestions();
                }}
                ListboxProps={{
                  style: { maxHeight: "500px" }, // ドロップダウンリストの高さを固定
                }}
              />
            </Grid>

            <Grid item xs={6} sm={6} md={4} lg={4}>
              <ToggleButtonGroup
                value={useServerData ? "server" : "local"}
                exclusive
                onChange={handleUserDataLocation}
                aria-label="text alignment"
                size="small"
                color="primary"
                style={{ maxHeight: "40px", overflow: "hidden", width: "100%", display: "flex" }}
              >
                <ToggleButton value="local" aria-label="left aligned" style={{ flexGrow: 1 }}>
                  <DevicesIcon fontSize="small" />
                  <span style={{ fontSize: "0.7rem", marginLeft: "6px" }}>ローカル</span>
                </ToggleButton>
                <ToggleButton value="server" aria-label="right aligned" style={{ flexGrow: 1 }}>
                  <CloudIcon fontSize="small" />
                  <span style={{ fontSize: "0.7rem", marginLeft: "6px" }}>サーバ</span>
                </ToggleButton>
              </ToggleButtonGroup>
            </Grid>

            {Object.keys(staticData["武器"]).map((key) => {
              if (
                key === "属性" ||
                key === "スロット" ||
                key === "elementKV" ||
                key === "elementKVEN2JP"
              )
                return null;
              else {
                return (
                  <Grid item key={key} xs={6} sm={6} md={4} lg={4}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">{key}</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        size="small"
                        value={userInputDataWeapon[key]}
                        label={key}
                        onChange={(e, v) => handleChangeUserInputData(key, e, v)}
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
                        {Object.keys(staticData["武器"][key])
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
                  </Grid>
                );
              }
            })}
          </Grid>
        </Grid>

        <Grid item xs={12} sm={12} md={6}>
          <Grid
            container
            columnSpacing={2}
            paddingX={3}
            marginTop={matches ? 2 : 0}
            justifyContent={"flex-end"}
          >
            <Grid item xs={12} sm={8} md={12} marginBottom={2}>
              <div style={{ width: "100%" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tbody>
                    {/* 武器名 */}
                    <tr style={{ borderBottom: "1px solid #ccc" }}>
                      <th
                        style={{
                          padding: "8px",
                          textAlign: "left",
                          fontSize: "0.9rem",
                          fontWeight: "normal",
                          color: "gray",
                          minWidth: "80px",
                        }}
                      >
                        武器名
                      </th>
                      <td style={{ padding: "8px" }}>
                        {userInputDataWeapon["選択武器"]?.name || null}
                      </td>
                    </tr>

                    {/* 攻撃力 */}
                    <tr style={{ borderBottom: "1px solid #ccc" }}>
                      <th
                        style={{
                          padding: "8px",
                          textAlign: "left",
                          fontSize: "0.9rem",
                          fontWeight: "normal",
                          color: "gray",
                        }}
                      >
                        攻撃力
                      </th>
                      <td style={{ padding: "8px" }}>
                        {userInputDataWeapon["選択武器"]?.raw || null}
                      </td>
                    </tr>

                    {/* 会心率 */}
                    <tr style={{ borderBottom: "1px solid #ccc" }}>
                      <th
                        style={{
                          padding: "8px",
                          textAlign: "left",
                          fontSize: "0.9rem",
                          fontWeight: "normal",
                          color: "gray",
                        }}
                      >
                        会心率
                      </th>
                      <td style={{ padding: "8px" }}>
                        {userInputDataWeapon["選択武器"] &&
                          userInputDataWeapon["選択武器"].affinity + "%"}
                      </td>
                    </tr>

                    {/* 属性 */}
                    <tr style={{ borderBottom: "1px solid #ccc" }}>
                      <th
                        style={{
                          padding: "8px",
                          textAlign: "left",
                          fontSize: "0.9rem",
                          fontWeight: "normal",
                          color: "gray",
                        }}
                      >
                        属性
                      </th>
                      <td style={{ padding: "8px" }}>
                        {userInputDataWeapon["選択武器"] &&
                          (userInputDataWeapon["選択武器"].elementType === "none"
                            ? ""
                            : `${
                                staticData["武器"]["elementKVEN2JP"][
                                  userInputDataWeapon["選択武器"].elementType
                                ]
                              } ${userInputDataWeapon["選択武器"].element}`)}
                      </td>
                    </tr>

                    {/* スロット */}
                    <tr style={{ borderBottom: "1px solid #ccc" }}>
                      <th
                        style={{
                          padding: "8px",
                          textAlign: "left",
                          fontSize: "0.9rem",
                          fontWeight: "normal",
                          color: "gray",
                        }}
                      >
                        スロット
                      </th>
                      <td style={{ padding: "8px" }}>
                        {userInputDataWeapon["選択武器"]?.slots.join("-")}
                      </td>
                    </tr>

                    {/* スキル */}
                    <tr style={{ borderBottom: "1px solid #ccc" }}>
                      <th
                        style={{
                          padding: "8px",
                          textAlign: "left",
                          fontSize: "0.9rem",
                          fontWeight: "normal",
                          color: "gray",
                        }}
                      >
                        スキル
                      </th>
                      <td style={{ padding: "8px" }}>
                        {userInputDataWeapon["選択武器"] &&
                          Object.entries(userInputDataWeapon["選択武器"].skills).map(
                            ([skill, level]) => (
                              <div key={skill}>
                                {skill} Lv{level}
                              </div>
                            )
                          )}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Grid>
          </Grid>
        </Grid>

        {/* <div>{JSON.stringify(userInputDataWeapon["選択武器"])}</div> */}
      </>
    );
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps.userInputDataWeapon, nextProps.userInputDataWeapon);
  }
);

export default WeaponSetting;
