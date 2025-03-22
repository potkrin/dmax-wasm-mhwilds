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
import { staticData } from "../data/StaticData";

import { theme, lightTheme, darkTheme, breakpoints } from "../src/theme";
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  useColorScheme,
} from "@mui/material/styles";

export function ArtianTable({
  userArtianData,
  deleteUserArtians,
  fetchUserArtianData,
  handleOpenDeleteConfirmDialog,
  userArtianMetaData,
}) {
  //should be memoized or stable
  const columns = useMemo(
    () => [
      {
        accessorKey: "raw",
        header: "攻撃力",
        size: 100,
      },
      {
        accessorKey: "affinity",
        header: "会心率",
        size: 100,
      },
      {
        accessorKey: "element",
        header: "属性",
        size: 100,
      },
      {
        accessorKey: "slots",
        header: "スロット",
        size: 100,
      },
    ],
    []
  );

  // テーブル表示用データ
  const [tableData, setTableData] = useState([]);

  console.log("userArtianData", userArtianData);

  // userArtianData が変更されたらテーブル表示用データを更新
  useEffect(() => {
    const newTableData = [];
    for (const artian of userArtianData) {
      const tempRow = {
        "raw": artian.raw,
        "affinity": artian.affinity + "%",
        "slots": artian.slots.join("-"),
      };

      if (artian.elementType !== "none") {
        tempRow["element"] =
          staticData["武器"]["elementKVEN2JP"][artian.elementType] + " " + artian.element;
      } else {
        tempRow["element"] = "";
      }

      newTableData.unshift(tempRow);
    }
    setTableData(newTableData);
  }, [userArtianData]);

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
            const artianTotal = Object.keys(userArtianData).length;
            table.getSelectedRowModel().flatRows.map((row) => {
              deleteTargetRows.push(artianTotal - parseInt(row.id) - 1);
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
                {fetchUserArtianData && (
                  <ManualSyncButton fetchUserEquipData={fetchUserArtianData} />
                )}
                {userArtianMetaData && (
                  <div>
                    <Tooltip title="最終更新日時とデータの更新回数" placement="top">
                      <div>
                        <Typography
                          variant="body1"
                          component="div"
                          sx={{ flexGrow: 1, fontSize: "0.7rem" }}
                          color="text.secondary"
                        >
                          {new Date(userArtianMetaData.updated_at).toLocaleString()}
                        </Typography>
                        <Typography
                          variant="body1"
                          component="div"
                          sx={{ flexGrow: 1, fontSize: "0.7rem" }}
                          color="text.secondary"
                        >
                          ver.{userArtianMetaData.revision_number}
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

export default ArtianTable;
