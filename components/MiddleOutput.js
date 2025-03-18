import React, { useRef, useEffect } from "react";
import { Grid, Typography, CircularProgress, Divider, useMediaQuery, Box } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ErrorIcon from "@mui/icons-material/Error";
import CancelIcon from "@mui/icons-material/Cancel";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import { breakpoints, theme } from "../src/theme";
import MemoryIcon from "@mui/icons-material/Memory";

function NewlineText({ text }) {
  const newText = text
    .split("\n")
    .map((str, index, array) => (index === array.length - 1 ? str : `${str}<br/>`))
    .join("");

  return <span dangerouslySetInnerHTML={{ __html: newText }} />;
}

export const MiddleOutput = ({ middleOutput, memoryLimit }) => {
  const matches = useMediaQuery("(max-width: " + breakpoints.values.sm + "px)"); // 'sm' は600pxに設定されていることが多い

  return (
    <>
      <Grid container alignItems={"center"} spacing={0} marginBottom={0.8}>
        <Grid item xs={0.8} sm={0.5}>
          {middleOutput.status === "running" && (
            <CircularProgress size={10} sx={{ color: theme.vars.palette.primary.main }} />
          )}
          {middleOutput.status === "complete" && (
            <CheckIcon color="success" sx={{ fontSize: 16 }} />
          )}
          {middleOutput.status === "error" && <ErrorIcon color="error" sx={{ fontSize: 16 }} />}
          {middleOutput.status === "unexpected error" && (
            <ErrorIcon color="error" sx={{ fontSize: 16 }} />
          )}
          {middleOutput.status === "interrupted" && (
            <CancelIcon color="error" sx={{ fontSize: 16 }} />
          )}

          {middleOutput.status === "waiting" && (
            <PanoramaFishEyeIcon sx={{ fontSize: 12, color: theme.vars.palette.text.disabled }} />
          )}
        </Grid>
        <Grid item xs={5.2} sm={5.5}>
          <Typography variant="body1" sx={{}}>
            {middleOutput.title}
          </Typography>
        </Grid>
        <Grid item xs={6} sm={6} container justifyContent="flex-end" alignItems="center">
          {memoryLimit && (
            <Box
              sx={{
                [`@media (min-width: ${breakpoints.values.sm + 1}px)`]: {
                  display: "none",
                },
                display: "flex",
              }}
            >
              <MemoryIcon sx={{ color: theme.vars.palette.text.hint, fontSize: "large" }} />
              <Typography
                sx={{
                  color: theme.vars.palette.text.hint,
                  paddingRight: "0.5rem",
                  alignItems: "center",
                  fontSize: "0.8rem",
                }}
              >
                メモリ上限 {memoryLimit}
              </Typography>
            </Box>
          )}
        </Grid>
        <Grid item xs={0.8} sm={0.5}></Grid>
        <Grid item xs={2.7} sm={3}>
          <Divider />
        </Grid>
        <Grid item xs={8.5} sm={8.5}></Grid>

        {middleOutput.message !== "" ? (
          <>
            <Grid item xs={0.8} sm={0.5}></Grid>
            <Grid item xs={11.2} sm={11.5}>
              <Typography
                variant="body1"
                sx={{
                  fontSize: "12px",
                  color:
                    (middleOutput.status === "error") |
                    (middleOutput.status === "interrupted") |
                    (middleOutput.status === "unexpected error")
                      ? theme.vars.palette.error.main
                      : theme.vars.palette.text.secondary,
                }}
              >
                <NewlineText text={middleOutput.message} />
              </Typography>
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={0.5}></Grid>
            <Grid item xs={11.5}>
              <Typography
                variant="body1"
                sx={{
                  fontSize: "12px",
                  color: theme.vars.palette.text.secondary,
                  visibility: "hidden",
                }}
              >
                invisible
              </Typography>
            </Grid>
          </>
        )}
      </Grid>
    </>
  );
};

export default MiddleOutput;
