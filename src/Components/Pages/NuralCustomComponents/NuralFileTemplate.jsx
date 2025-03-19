import React, { useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DARK_PURPLE, LIGHT_GRAY2, MEDIUM_BLUE, PRIMARY_BLUE2 } from "../../Common/colors";

const StyledAccordion = styled(Accordion)(({ isExpanded }) => ({
  backgroundColor: "white",
  boxShadow: "none",
  borderRadius: "8px !important",
  position: "relative",
  transition: "all 0.3s ease-in-out",
  "&:before": {
    display: "none",
  },
  "&.Mui-expanded": {
    margin: "0 !important",
  },
  "& .MuiAccordionSummary-root": {
    backgroundColor: MEDIUM_BLUE,
    borderRadius: isExpanded ? "8px 8px 0 0" : "8px",
    transition: "all 0.3s ease-in-out",
    marginBottom: 0,
  },
  "& .MuiAccordionSummary-content": {
    color: DARK_PURPLE,
    margin: "12px 0",
  },
  "& .MuiAccordionSummary-expandIconWrapper .MuiSvgIcon-root": {
    color: DARK_PURPLE,
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
}));

const StyledAccordionSummary = styled(AccordionSummary)({
  padding: "0 16px",
  minHeight: "48px !important",
  "& .MuiAccordionSummary-content": {
    margin: "12px 0",
  },
  "&.MuiButtonBase-root": {
    "&:focus": {
      outline: "none",
    },
  },
  "&.MuiAccordionSummary-root": {
    "&:focus": {
      outline: "none",
    },
  },
});

const StyledAccordionDetails = styled(AccordionDetails)(
  ({ backgroundColor, padding }) => ({
    padding: padding || "16px",
    backgroundColor: backgroundColor || LIGHT_GRAY2,
    borderRadius: "0 0 8px 8px",
    margin: "0px",
  })
);

const NuralAccordion2 = ({
  title = "Activations",
  children,
  controlled = false,
  defaultExpanded = true,
  expanded: externalExpanded,
  onChange: externalOnChange,
  ...props
}) => {
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);

  const isExpanded = controlled ? externalExpanded : internalExpanded;

  const handleChange = (event, expanded) => {
    if (controlled) {
      externalOnChange?.(event, expanded);
    } else {
      setInternalExpanded(expanded);
    }
  };

  return (
    <StyledAccordion
      expanded={isExpanded}
      onChange={handleChange}
      isExpanded={isExpanded}
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
        backgroundColor: "transparent",
        // borderRadius: props.borderRadius || "8px",

        ...props.sx,
      }}
      {...props}
    >
      <StyledAccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography
          sx={{
            fontSize: props.titleFontSize || "12px",
            fontWeight: props.titleFontWeight || 600,
            color: props.titleColor || PRIMARY_BLUE2,
          }}
        >
          {title}
        </Typography>
      </StyledAccordionSummary>
      <StyledAccordionDetails
        backgroundColor={props.backgroundColor}
        padding={props.padding}
      >
        {children}
      </StyledAccordionDetails>
    </StyledAccordion>
  );
};

export default NuralAccordion2;
