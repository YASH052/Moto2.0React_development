import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VisibilityIcon from "@mui/icons-material/Visibility";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import NuralTextButton from "./NuralTextButton";
import { DARK_PURPLE, PRIMARY_BLUE2, PRIMARY_LIGHT_PURPLE2 } from "../../Common/colors";

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

const TemplateItem = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 16px",
  borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
  "&:last-child": {
    borderBottom: "none",
  },
});

const ActionButtons = styled(Box)({
  display: "flex",
  gap: "16px",
});

const IconButton = styled(Box)({
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  "& svg": {
    width: "20px",
    height: "20px",
    color: DARK_PURPLE,
  },
  "&:hover svg": {
    color: PRIMARY_BLUE2,
  },
});

const ButtonContainer = styled(Box)({
  display: "flex",
  gap: "16px",
  padding: "16px",
  borderTop: "1px solid rgba(0, 0, 0, 0.1)",
});

const NuralAccordion = ({ title, templates, ...props }) => {
  return (
    <StyledAccordion
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

        // Border
        border: props.border,
        borderColor: props.borderColor,
        borderWidth: props.borderWidth,
        borderStyle: props.borderStyle,

        // Shadow
        boxShadow: props.boxShadow,

        ...props.sx
      }}
      {...props}
    >
      <StyledAccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: props.expandIconColor || DARK_PURPLE }} />}
        sx={props.summaryStyle}
      >
        <Typography
          sx={{
            fontSize: props.titleFontSize || "14px",
            fontWeight: props.titleFontWeight || 600,
            color: props.titleColor || DARK_PURPLE,
            ...props.titleStyle
          }}
        >
          {title}
        </Typography>
      </StyledAccordionSummary>
      <AccordionDetails sx={{ padding: 0, ...props.detailsStyle }}>
        {templates.map((template, index) => (
          <TemplateItem 
            key={index}
            sx={{
              padding: props.itemPadding || "12px 16px",
              borderBottom: props.itemBorder || "1px solid rgba(0, 0, 0, 0.1)",
              ...props.itemStyle
            }}
          >
            <Typography
              sx={{
                fontSize: props.itemFontSize || "14px",
                fontWeight: props.itemFontWeight || 500,
                color: props.itemColor || DARK_PURPLE,
                ...props.itemTextStyle
              }}
            >
              {template.name}
            </Typography>
            <ActionButtons sx={props.actionButtonsStyle}>
              <IconButton 
                onClick={() => template.onView?.()} 
                sx={props.iconButtonStyle}
              >
                <VisibilityIcon />
              </IconButton>
              <IconButton 
                onClick={() => template.onDownload?.()} 
                sx={props.iconButtonStyle}
              >
                <FileDownloadIcon />
              </IconButton>
            </ActionButtons>
          </TemplateItem>
        ))}
        <ButtonContainer sx={props.buttonContainerStyle}>
          <NuralTextButton
            icon={"./Icons/searchIcon.svg"}
            iconPosition="right"
            backgroundColor={PRIMARY_LIGHT_PURPLE2}
            color="#fff"
            width="100%"
            {...props.binButtonProps}
          >
            BIN CODE
          </NuralTextButton>
          <NuralTextButton
            icon={"./Icons/searchIcon.svg"}
            iconPosition="right"
            backgroundColor={PRIMARY_LIGHT_PURPLE2}
            color="#fff"
            width="100%"
            {...props.referenceButtonProps}
          >
            REFERENCE CODE
          </NuralTextButton>
        </ButtonContainer>
      </AccordionDetails>
    </StyledAccordion>
  );
};

export default NuralAccordion; 