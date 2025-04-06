import React from "react";
import { Box, Container, Typography, Link } from "@mui/material";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 2,
        px: 2,
        mt: "auto",
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            whiteSpace: "nowrap",
          }}
        >
          <Typography variant="body1" color="text.secondary">
            DMAX MHWilds ver.2.0.0
          </Typography>
          <Link href="https://x.com/blob_cozy" target="_blank" rel="noopener" sx={{ ml: 1 }}>
            @blob_cozy
          </Link>
        </Box>
        <Typography variant="body2" color="text.secondary" align="center" noWrap>
          © {currentYear} {"www.mhrspeedrun.com. All rights reserved."}
        </Typography>
      </Container>
    </Box>
  );
}
