import React from "react";
import { Box, Checkbox, Typography } from "@mui/material";
import { PRIMARY_BLUE, WHITE, BLACK } from "../../Common/colors";

const SelectionCheckboxItem = ({ label, selected, onSelect }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        mb: 1,
        cursor: "pointer",
      }}
      onClick={onSelect}
    >
      <Checkbox
        sx={{
          width: "32px",
          height: "32px",
          boxShadow: "0px 1px 2px rgba(16, 24, 40, 0.05)",
          padding: 0,
          "&.Mui-checked": {
            border: "none",
            "& .MuiSvgIcon-root": {
              color: PRIMARY_BLUE,
            },
          },
          "& .MuiSvgIcon-root": {
            fontSize: "24px",
          },
        }}
        checked={selected}
        onChange={onSelect}
      />
      <Typography
        sx={{
          ml: 1,
          color: selected ? WHITE : BLACK,
          backgroundColor: selected ? PRIMARY_BLUE : "transparent",
          padding: "8px 16px",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: 500,
          width: "200px",
          textAlign: "left",
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

export default SelectionCheckboxItem;
