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
import { DARK_PURPLE, LIGHT_GRAY2 } from "../../Common/colors";
import NuralRadioButton from "./NuralRadioButton";

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
  "&.Mui-disabled": {
    backgroundColor: LIGHT_GRAY2,
    opacity: 1,
    borderRadius: "8px !important",
    border: "none",
    "&:before": {
      display: "none",
    },
    "& .MuiTypography-root": {
      color: `${DARK_PURPLE} !important`,
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
  "&.Mui-disabled": {
    backgroundColor: LIGHT_GRAY2,
    opacity: 1,
    borderRadius: "8px !important",
    border: "none",
    "&:before": {
      display: "none",
    },
    "& .MuiTypography-root": {
      color: `${DARK_PURPLE} !important`,
    },
  },
});

const NuralUploadFormat = ({ title, onChange, value, showExpandIcon = true, ...props }) => {
  const handleRadioChange = (newValue) => {
    console.log("Radio value changed:", newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <StyledAccordion
      defaultExpanded
      disabled={!showExpandIcon}
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
          showExpandIcon ? (
            <ExpandMoreIcon
              sx={{ color: props.expandIconColor || DARK_PURPLE }}
            />
          ) : null
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
        <Box sx={{ marginBottom: "12px" }}>
          <Typography
            textAlign={"start"}
            fontSize={"10px"}
            fontWeight={400}
            color={DARK_PURPLE}
          >
            SELECT MODE
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "start",
            justifyContent: "start",
          }}
        >
          <NuralRadioButton
            options={props.options}
            color={LIGHT_GRAY2}
            value={value}
            onChange={handleRadioChange}
            padding="0px"
            {...props.radioProps}
          />
        </Box>
      </AccordionDetails>

    </StyledAccordion>
  );
};

export default NuralUploadFormat;

