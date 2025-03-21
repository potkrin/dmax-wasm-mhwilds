import { Tabs, Tab, Container } from "@mui/material";
import ArtianManager from "./ArtianManager";
import ServerArtianManager from "./ServerArtianManager";
import { TabPanel } from "./App";
import { useMemo } from "react";
import { useArtianContext } from "./ArtianContext";
import CloudIcon from "@mui/icons-material/Cloud";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import DevicesIcon from "@mui/icons-material/Devices";

function ArtianTab(props) {
  const { artianValue, handleChangeArtianValue, isArtianDataFetched } = useArtianContext();

  return useMemo(
    () => (
      <>
        <Tabs
          value={artianValue}
          onChange={handleChangeArtianValue}
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
            icon={isArtianDataFetched ? <CloudIcon /> : <CloudOffIcon />}
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
          <TabPanel value={artianValue} index={0}>
            <ArtianManager />
          </TabPanel>
          <TabPanel value={artianValue} index={1}>
            <ServerArtianManager />
          </TabPanel>
        </Container>
      </>
    ),
    [artianValue, handleChangeArtianValue, isArtianDataFetched]
  );
}

export default ArtianTab;
