import React, { useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Select,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE,
  PRIMARY_BLUE2,
} from "../../Common/colors";
import NuralRadioButton from "./NuralRadioButton";
import NuralCalendar from "./NuralCalendar";
import NuralAccordion from "./NuralAccordion";
import NuralAutocomplete from "./NuralAutocomplete";
import Required from "../../Common/Required";

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

// const option = [
//   { id: 1, name: "Full Template" },
//   { id: 2, name: "Serial Only" },
// ];

const NuralUploadSaleReturn = ({
  title,
  onChange,
  selectedDate,
  onDateChange,
  value,
  option,
  onUserIdChange, // New prop to send userId to parent
  selectedUserId, // New prop to receive selected userId from parent
  ...props
}) => {
  const handleRadioChange = (newValue) => {
    console.log("Radio value changed:", newValue);
    if (onChange) {
      onChange(newValue);
    }
  };
  const handleDateChange = (newDate) => {
    console.log("Parent received date:", newDate);
    if (onDateChange) {
      onDateChange(newDate);
    }
  };
  const handleUserIdChange = (newValue) => {
    if (onUserIdChange) {
      onUserIdChange(newValue?.id || null); // Send the selected userId to parent
      console.log(newValue?.id, "onUserIdChange");
    }
  };
  // const [searchParams, setSearchParams] = useState({
  //   userId: 0,
  // });

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
        <Box display={"flex"} flex={"row"} gap={"1.5rem"}>
          <Box>
            <Box
              textAlign={"start"}
              fontSize={"10px"}
              fontWeight={400}
              color={PRIMARY_BLUE2}
            >
              DATE <Required />
            </Box>
            <NuralCalendar
              width="100%"
              placeholder="01/01/25"
              onChange={handleDateChange}
              value={selectedDate}
            />
          </Box>
          <Box>
            <Box>
              <Typography
                textAlign={"start"}
                fontSize={"10px"}
                fontWeight={400}
                color={PRIMARY_BLUE2}
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
          </Box>
        </Box>
        <Box pt={"1rem"}>
          <Typography
            sx={{
              color: PRIMARY_BLUE2,
              fontFamily: "Manrope",
              fontWeight: 400,
              fontSize: "10px",
              lineHeight: "13.66px",
              letterSpacing: "4%",
              mb: 1,
            }}
          >
            TEMPLATE TYPE <Required />
          </Typography>
          <NuralAutocomplete
            options={option}
            getOptionLabel={(option) => option.name || ""}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            onChange={(event, newValue) => {
              handleUserIdChange(newValue);
            }}
            value={
              option.find((option) => option.id === selectedUserId) || null
            }
            placeholder={"SERIAL ONLY"}
          />
        </Box>
      </AccordionDetails>
    </StyledAccordion>
  );
};

export default NuralUploadSaleReturn;
