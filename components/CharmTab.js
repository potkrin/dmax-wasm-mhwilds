import { Tabs, Tab, Container } from "@mui/material";
import CharmManager from "./CharmManager";
import ServerCharmManager from "./ServerCharmManager";
import { TabPanel } from "./App";
import { useMemo } from "react";
import { useCharmAndQuriousArmorContext } from "./CharmAndQuriousArmorContext";
import CloudIcon from "@mui/icons-material/Cloud";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import DevicesIcon from "@mui/icons-material/Devices";

function CharmTab(props) {
  const { charmValue, handleChangeCharmValue, isCharmDataFetched } =
    useCharmAndQuriousArmorContext();

  return useMemo(
    () => (
      <>
        <Tabs
          value={charmValue}
          onChange={handleChangeCharmValue}
          indicatorColor="primary"
          // textColor="inherit"
          // variant="fullWidth"
          aria-label="tabs example"
          // sx={{ minHeight: "0px" }}
        >
          <Tab
            label="ローカル"
            sx={{ minHeight: "0px" }}
            icon={<DevicesIcon />}
            iconPosition="start"
          />
          <Tab
            label="サーバー"
            sx={{ minHeight: "0px" }}
            icon={isCharmDataFetched ? <CloudIcon /> : <CloudOffIcon />}
            iconPosition="start"
          />
        </Tabs>
        <Container
          sx={{
            paddingLeft: "0px !important",
            paddingRight: "0px !important",
            marginBottom: "0px !important", // 追加
            paddingBottom: "0px !important", // 追加
          }}
        >
          <TabPanel value={charmValue} index={0}>
            <CharmManager />
          </TabPanel>
          <TabPanel value={charmValue} index={1}>
            <ServerCharmManager />
          </TabPanel>
        </Container>
      </>
    ),
    [charmValue, handleChangeCharmValue, isCharmDataFetched]
  );
}

export default CharmTab;
