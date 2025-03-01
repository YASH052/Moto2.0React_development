import React from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DARK_PURPLE } from "../../Common/colors";

const StyledAccordion = styled(Accordion)({
  backgroundColor: "rgba(235, 238, 245, 0.5)",
  boxShadow: "none",
  borderRadius: "8px !important",
  "&:before": {
    display: "none",
  },
  "&.Mui-expanded": {
    margin: 0,
  },
  "&.MuiAccordion-root": {
    "&:focus": {
      outline: "none",
    },
  },
  "& .MuiButtonBase-root": {
    "&:focus": {
      outline: "none",
    },
  },
});

const StyledAccordionSummary = styled(AccordionSummary)({
  padding: "0 16px",
  "& .MuiAccordionSummary-content": {
    margin: "12px 0",
  },
  "&.MuiButtonBase-root": {
    "&:focus": {
      outline: "none",
    },
  },
});

const NuralAccordion2 = ({ title = "Activations", children, ...props }) => {
  return (
    <StyledAccordion
      defaultExpanded
      sx={{
        // Size
        width: props.width,
        height: props.height,
        minWidth: props.minWidth,
        maxWidth: props.maxWidth,
        minHeight: props.minHeight,
        maxHeight: props.maxHeight,

        // Margins
        margin: props.margin,
        marginTop: props.marginTop,
        marginBottom: props.marginBottom,
        marginLeft: props.marginLeft,
        marginRight: props.marginRight,

        // Padding
        padding: props.padding,
        paddingTop: props.paddingTop,
        paddingBottom: props.paddingBottom,
        paddingLeft: props.paddingLeft,
        paddingRight: props.paddingRight,

        // Position
        display: props.display,
        position: props.position,
        top: props.top,
        bottom: props.bottom,
        left: props.left,
        right: props.right,
        zIndex: props.zIndex,

        // Colors
        backgroundColor: props.backgroundColor || "rgba(235, 238, 245, 0.5)",
        borderRadius: props.borderRadius || "8px",

        ...props.sx,
      }}
      {...props}
    >
      <StyledAccordionSummary
        expandIcon={
          <ExpandMoreIcon
            sx={{ color: props.expandIconColor || DARK_PURPLE }}
          />
        }
      >
        <Typography
          sx={{
            fontSize: props.titleFontSize || "14px",
            fontWeight: props.titleFontWeight || 600,
            color: props.titleColor || DARK_PURPLE,
          }}
        >
          {title}
        </Typography>
      </StyledAccordionSummary>
      <AccordionDetails sx={{ padding: "0 16px 16px" }}>
        {children}
      </AccordionDetails>
    </StyledAccordion>
  );
};

export default NuralAccordion2; 