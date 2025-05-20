import React from "react";
import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import { PRIMARY_BLUE, WHITE } from "../colors"; // Adjust path as necessary if colors are defined elsewhere
import { toggleButtonStyle } from "../commonstyles";



const QtyValToggle = ({ value, onChange }) => {
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      onChange={onChange}
      aria-label="quantity or value toggle"
      sx={{ height: "32px" }}
    >
      <ToggleButton value="qty" aria-label="quantity" sx={toggleButtonStyle}>
        QTY
      </ToggleButton>
      <ToggleButton value="val" aria-label="value" sx={toggleButtonStyle}>
        VAL
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default QtyValToggle;
