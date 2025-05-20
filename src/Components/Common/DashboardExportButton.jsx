import { Box, Button, Grid, Stack } from "@mui/material";
import React from "react";
import { DARK_PURPLE } from "./colors";

export const DashboardExportButton = ({ handleExportExcel, handleExportPDF }) => {
  const handleExcelClick = () => {
    if (typeof handleExportExcel === 'function') {
      handleExportExcel();
    }
  };

  const handlePDFClick = () => {
    if (typeof handleExportPDF === 'function') {
      handleExportPDF();
    }
  };
 
  return (
    <Grid
      sx={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        // p: 1,
        // mt: 1,
        gap: 2,
      }}
    >
      <Box sx={{ flexGrow: 1 }} />

      <Stack direction="row" spacing={1} alignItems="center">
        <Button
          variant="text"
          sx={{
            color: DARK_PURPLE,
            fontWeight: 700,
            fontSize: "8px",
            textTransform: "uppercase",
            "&:hover": { backgroundColor: "transparent" },
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            ":focus": { outline: "none" },
          }}
          onClick={handlePDFClick}
        >
          Export PDF
          <img
            src="/Images/pdf.svg"
            alt="PDF"
            style={{
              height: "24px",
              width: "24px",
              marginRight: "4px",
            }}
          />
        </Button>
        <Button
          variant="text"
          sx={{
            color: DARK_PURPLE,
            fontWeight: 700,
            fontSize: "8px",
            textTransform: "uppercase",
            "&:hover": { backgroundColor: "transparent" },
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            outline: "none",
            ":focus": { outline: "none" },
          }}
          onClick={handleExcelClick}
        >
          Export Excel
          <img
            src="/Images/xls.svg"
            alt="Excel"
            style={{
              height: "24px",
              width: "24px",
              marginRight: "4px",
            }}
          />
        </Button>
      </Stack>
    </Grid>
  );
};
