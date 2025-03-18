import React, { useState, useEffect, useMemo } from "react";
import {
  Button,
  ThemeProvider,
  createTheme,
  Tooltip,
  Typography,
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

export function QuriousArmorTable({
  userQuriousArmorData,
  deleteUserQuriousArmors,
  fetchUserQuriousArmorData,
  handleOpenDeleteConfirmDialog,
  userQuriousArmorMetaData,
}) {
  //should be memoized or stable
  const columns = useMemo(
    () => [
      {
        accessorKey: "armorName",
        header: "防具名",
        // size: 150,
      },
      {
        accessorKey: "skills",
        header: "スキル",
        // size: 250,
      },
      {
        accessorKey: "slots",
        header: "スロット",
        // size: 100,
      },
    ],
    []
  );

  // テーブル表示用データ
  const [tableData, setTableData] = useState([]);

  // userQuriousArmorData が変更されたらテーブル表示用データを更新
  useEffect(() => {
    const newTableData = [];
    for (const quriousArmor of userQuriousArmorData) {
      const tempRow = {
        "slots": quriousArmor.slots.join("-"),
      };
      tempRow["armorName"] = quriousArmor.originalArmorName;
      const skillList = Object.entries(quriousArmor.skills);

      tempRow["skills"] = "";
      for (const [skillName, skillLevel] of skillList) {
        tempRow["skills"] += skillName + "Lv" + skillLevel + " ";
      }
      newTableData.unshift(tempRow);
    }
    setTableData(newTableData);
  }, [userQuriousArmorData]);

  const matches = useMediaQuery("(max-width: " + breakpoints.values.sm + "px)"); // 'sm' は600pxに設定されていることが多い

  const { mode, setMode } = useColorScheme();
  console.log("debug: theme", theme);
  console.log("debug: mode", mode);

  // from: https://v1.material-react-table.com/docs/guides/customize-components
  const tableTheme = useMemo(
    () =>
      createTheme({
        palette: {
          // mode: currentTheme.palette.mode, //let's use the same dark/light mode as the current theme
          // mode: mode === "light" ? "light" : "dark", //let's use the same dark/light mode as the current theme
          // primary: currentTheme.palette.primary, //swap in the secondary color as the primary for the table
          // secondary: currentTheme.palette.secondary, //swap in the primary color as the secondary for the table
          // info: {
          //   main: "rgb(255,122,0)", //add in a custom color for the toolbar alert background stuff
          // },
          background: {
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

  const [mounted, setMounted] = React.useState(false);

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
            const quriousArmorTotal = Object.keys(userQuriousArmorData).length;
            table.getSelectedRowModel().flatRows.map((row) => {
              deleteTargetRows.push(quriousArmorTotal - parseInt(row.id) - 1);
            });

            // 管理データから削除 (useEffect によりテーブルや localstorage にも反映される)
            handleOpenDeleteConfirmDialog(deleteTargetRows);
            table.resetRowSelection();
          };

          return (
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
              {fetchUserQuriousArmorData && (
                <ManualSyncButton fetchUserEquipData={fetchUserQuriousArmorData} />
              )}
              {userQuriousArmorMetaData && (
                <div>
                  <Tooltip title="最終更新日時とデータの更新回数" placement="top">
                    <div>
                      <Typography
                        variant="body1"
                        component="div"
                        sx={{ flexGrow: 1, fontSize: "0.7rem" }}
                        color="text.secondary"
                      >
                        {new Date(userQuriousArmorMetaData.updated_at).toLocaleString()}
                      </Typography>
                      <Typography
                        variant="body1"
                        component="div"
                        sx={{ flexGrow: 1, fontSize: "0.7rem" }}
                        color="text.secondary"
                      >
                        ver.{userQuriousArmorMetaData.revision_number}
                      </Typography>
                    </div>
                  </Tooltip>
                </div>
              )}
            </div>
          );
        }}
      />
    </ThemeProvider>
  );
}

export default QuriousArmorTable;
