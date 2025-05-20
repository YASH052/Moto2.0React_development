import React from "react";
import {
  Radio,
  FormControlLabel,
  RadioGroup,
  FormControl,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  PRIMARY_LIGHT_PURPLE,
  PRIMARY_BLUE2,
  AQUA_DARK,
  DARK_PURPLE,
  LIGHT_GRAY,
  LIGHT_GRAY2,
} from "../../Common/colors";

const StyledRadio = styled(Radio)({
  padding: "8px",
  "&:hover": {
    backgroundColor: "transparent",
  },
  "& .MuiSvgIcon-root": {
    width: "28px",
    height: "28px",
    color: "#FFFFFF",
  },
  // Enhance the inner dot when checked
  "& .MuiSvgIcon-root:nth-of-type(2)": {
    transform: "scale(0)",
    transition: "transform 0.2s",
    color: DARK_PURPLE,
  },
  "&.Mui-checked .MuiSvgIcon-root:nth-of-type(2)": {
    transform: "scale(1.4)", // Makes the inner dot larger when checked
  },
  "&.Mui-checked .MuiSvgIcon-root:first-of-type": {
    color: "#FFFFFF",
  },
});

const NuralRadioButton = ({
  options = [
    { value: "yes", label: "Yes" },
    { value: "no", label: "No" },
  ],
  value,
  onChange,
  ...props
}) => {
  const handleChange = (event) => {
    // Get the selected value directly from the event
    const selectedValue = event.target.value;
    // console.log("NuralRadioButton selected value:", selectedValue);

    // Call onChange with just the value instead of the event
    if (onChange) {
      // If clicking the same value, unselect it
      if (selectedValue === value) {
        onChange("");
      } else {
        onChange(selectedValue);
      }
    }
  };

  return (
    <FormControl
      sx={{
        // backgroundColor: LIGHT_GRAY,
        padding: "10px",
      }}
    >
      <RadioGroup
        row={props.row || true}
        value={value || ""} // Ensure value is never undefined
        onChange={handleChange}
        sx={{
          color: DARK_PURPLE,
          gap: props.gap || "40px",
          textAlign: props.textAlign || "left",
          position: props.position || "relative",
          display: props.display || "flex",
          justifyContent: props.justifyContent || "flex-start",
          alignItems: props.alignItems || "start",
          border: props.border,
          width: props.width || "100%",
          height: props.height || "100%",
          padding: props.padding || "0",
          margin: props.margin || "0",
          backgroundColor: props.backgroundColor || "transparent",
          borderRadius: props.borderRadius || "0",
          borderColor: props.borderColor || "transparent",
          borderWidth: props.borderWidth || "0",
          ...props.sx,
        }}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={
              <StyledRadio
                sx={{

                  // Size
                  width: props.width || "24px",
                  height: props.height || "24px",
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
                  padding: props.padding || "8px",
                  paddingTop: props.paddingTop,
                  paddingBottom: props.paddingBottom,
                  paddingLeft: props.paddingLeft,
                  paddingRight: props.paddingRight,

                  // Colors
                  color: props.color || LIGHT_GRAY2,
                  "&.Mui-checked": {
                    color: props.checkedColor || DARK_PURPLE,
                  },
                  // States
                  "&:hover": {

                    // "& .MuiSvgIcon-root": {
                    //   color: props.hoverColor || PRIMARY_LIGHT_PURPLE,
                    // },
                  },
                  // "&.Mui-disabled": {
                  //   color: props.disabledColor || "rgba(0, 0, 0, 0.38)",
                  // },
                  ...props.sx,
                }}
                disabled={option.disabled || false}
              />
            }
            label={option.label}
            disabled={option.disabled || false}
            sx={{
              margin: 0,
              // Label styling
              "& .MuiFormControlLabel-label": {
                fontFamily: props.fontFamily,
                fontSize: props.fontSize || "16px",
                fontWeight: props.fontWeight || 500,
                lineHeight: props.lineHeight,
                letterSpacing: props.letterSpacing,
                color: props.labelColor || "inherit",
                paddingLeft: "8px",
                "&.Mui-disabled": {
                  color: props.disabledLabelColor || "rgba(0, 0, 0, 0.38)",
                },
              },
              // Selected state styling for the entire label
              "&.Mui-checked": {
                "& .MuiFormControlLabel-label": {
                  color: props.checkedColor || PRIMARY_LIGHT_PURPLE,
                  fontWeight: 600,
                },
              },
              // Hover state for the entire label
              "&:hover": {
                "& .MuiFormControlLabel-label": {
                  color: props.hoverColor || PRIMARY_LIGHT_PURPLE,
                },
              },
              ...props.labelSx,
            }}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default NuralRadioButton;
