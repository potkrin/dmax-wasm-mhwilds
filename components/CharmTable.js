import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Chip,
  ThemeProvider,
  Tooltip,
  Typography,
  createTheme,
  useMediaQuery,
} from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import ManualSyncButton from "./ManualSyncButton";
import DeleteIcon from "@mui/icons-material/Delete";

import { theme, lightTheme, darkTheme, breakpoints } from "../src/theme";
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  useColorScheme,
} from "@mui/material/styles";

export function CharmTable({
  userCharmData,
  deleteUserCharms,
  fetchUserCharmData,
  handleOpenDeleteConfirmDialog,
  userCharmMetaData,
}) {
  //should be memoized or stable
  const columns = useMemo(
    () => [
      {
        accessorKey: "firstSkill",
        header: "第一スキル",
        size: 150,
      },
      {
        accessorKey: "secondSkill",
        header: "第二スキル",
        size: 150,
      },
      {
        accessorKey: "slots",
        header: "スロット",
        size: 200,
      },
    ],
    []
  );

  // テーブル表示用データ
  const [tableData, setTableData] = useState([]);

  // userCharmData が変更されたらテーブル表示用データを更新
  useEffect(() => {
    const newTableData = [];
    for (const charm of userCharmData) {
      const tempRow = {
        "slots": charm.slots.join("-"),
      };
      const skillList = Object.entries(charm.skills);
      tempRow["firstSkill"] = skillList[0] ? skillList[0][0] + "Lv" + skillList[0][1] : "";
      tempRow["secondSkill"] = skillList[1] ? skillList[1][0] + "Lv" + skillList[1][1] : "";
      newTableData.unshift(tempRow);
    }
    setTableData(newTableData);
  }, [userCharmData]);

  const matches = useMediaQuery("(max-width: " + breakpoints.values.sm + "px)"); // 'sm' は600pxに設定されていることが多い

  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);

  // from: https://v1.material-react-table.com/docs/guides/customize-components
  const tableTheme = useMemo(
    () =>
      createTheme({
        palette: {
          // mode: mode === "light" ? "light" : "dark", //let's use the same dark/light mode as the current theme
          // // primary: currentTheme.vars.palette.primary, //swap in the secondary color as the primary for the table
          // primary: mode === "light" ? lightTheme.palette.primary : darkTheme.palette.primary,
          // // secondary: currentTheme.palette.secondary, //swap in the primary color as the secondary for the table
          // secondary: mode === "light" ? lightTheme.palette.secondary : darkTheme.palette.secondary,
          // info: {
          //   main: currentTheme.palette.info.main,
          //   // main: mode === "light" ? lightTheme.palette.info.main : darkTheme.palette.info.main,
          // },
          background: {
            // default: currentTheme.palette.background.paper,
            default:
              mode === "light"
                ? lightTheme.palette.background.paper
                : darkTheme.palette.background.paper,
          },
        },
        typography: {
          button: {
            textTransform: "none", //customize typography styles for all buttons in table by default
            fontSize: "14px",
          },
        },
        components: {
          MuiTooltip: {
            styleOverrides: {
              tooltip: {
                fontSize: "1.1rem", //override to make tooltip font size larger
              },
            },
          },
        },
      }),
    [mode]
  );

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // for server-side rendering
    // learn more at https://github.com/pacocoursey/next-themes#avoid-hydration-mismatch
    return null;
  }

  return (
    <ThemeProvider theme={tableTheme}>
      <MaterialReactTable
        columns={columns}
        data={tableData}
        enablePagination={true}
        enableRowSelection
        enableDensityToggle={false}
        enableFullScreenToggle={false}
        enableHiding={false}
        enableColumnFilters={false}
        enableMultiRowSelection
        enableSelectAll
        muiSearchTextFieldProps={{
          // placeholder: "Search all users",
          sx: { maxWidth: "180px" },
          variant: "outlined",
        }}
        renderTopToolbarCustomActions={({ table }) => {
          const handleDelete = () => {
            // 削除対象のインデックスを作成
            const deleteTargetRows = [];
            const charmTotal = Object.keys(userCharmData).length;
            table.getSelectedRowModel().flatRows.map((row) => {
              deleteTargetRows.push(charmTotal - parseInt(row.id) - 1);
            });

            // 管理データから削除 (useEffect によりテーブルや localstorage にも反映される)
            handleOpenDeleteConfirmDialog(deleteTargetRows);
            table.resetRowSelection();
          };

          return (
            <>
              <div
                style={{
                  gap: "0.5rem",
                  display: "flex",
                  flexDirection: matches ? "column" : "row",
                }}
              >
                <Button
                  color="secondary"
                  disabled={!table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected()}
                  onClick={handleDelete}
                  variant="contained"
                  startIcon={<DeleteIcon />}
                >
                  削除
                </Button>
                {fetchUserCharmData && <ManualSyncButton fetchUserEquipData={fetchUserCharmData} />}
                {userCharmMetaData && (
                  <div>
                    <Tooltip title="最終更新日時とデータの更新回数" placement="top">
                      <div>
                        <Typography
                          variant="body1"
                          component="div"
                          sx={{ flexGrow: 1, fontSize: "0.7rem" }}
                          color="text.secondary"
                        >
                          {new Date(userCharmMetaData.updated_at).toLocaleString()}
                        </Typography>
                        <Typography
                          variant="body1"
                          component="div"
                          sx={{ flexGrow: 1, fontSize: "0.7rem" }}
                          color="text.secondary"
                        >
                          ver.{userCharmMetaData.revision_number}
                        </Typography>
                      </div>
                    </Tooltip>
                  </div>
                )}
              </div>
            </>
          );
        }}
      />
    </ThemeProvider>
  );
}

export default CharmTable;
