import { Tabs, Tab, Container } from "@mui/material";
import QuriousArmorManager from "./QuriousArmorManager";
import ServerQuriousArmorManager from "./ServerQuriousArmorManager";
import { TabPanel } from "./App";
import { useMemo } from "react";
import { useCharmAndQuriousArmorContext } from "./CharmAndQuriousArmorContext";
import CloudIcon from "@mui/icons-material/Cloud";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import DevicesIcon from "@mui/icons-material/Devices";

function QuriousArmorTab(props) {
  const { quriousArmorValue, handleChangeQuriousArmorValue, isQuriousArmorDataFetched } =
    useCharmAndQuriousArmorContext();

  return useMemo(
    () => (
      <>
        <Tabs
          value={quriousArmorValue}
          onChange={handleChangeQuriousArmorValue}
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
            icon={isQuriousArmorDataFetched ? <CloudIcon /> : <CloudOffIcon />}
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
          <TabPanel value={quriousArmorValue} index={0}>
            <QuriousArmorManager />
          </TabPanel>
          <TabPanel value={quriousArmorValue} index={1}>
            <ServerQuriousArmorManager />
          </TabPanel>
        </Container>
      </>
    ),
    [quriousArmorValue, handleChangeQuriousArmorValue, isQuriousArmorDataFetched]
  );
}

export default QuriousArmorTab;
