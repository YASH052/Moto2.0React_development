import { Autocomplete, TextField } from "@mui/material";
import React, { useState } from "react";
import { PRIMARY_BLUE2, PRIMARY_LIGHT_GRAY } from "../../Common/colors";

const NuralAutocomplete = ({
  options = [
    "Nural Network",
    "Deep Learning",
    "Machine Learning",
    "Artificial Intelligence",
    "Computer Vision",
  ],
  placeholderText = "SELECT",
  onSelect = () => {},
  ...props
}) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);

  const handleChange = (event, newValue) => {
    setSelectedValue(newValue);
    onSelect(newValue);
  };

  return (
    <Autocomplete
      options={options}
      value={selectedValue}
      onChange={handleChange}
      inputValue={inputValue}
      onInputChange={(event, newValue) => {
        setInputValue(newValue);
      }}
      sx={{
        width: props.width || "232px",
        height: props.height || "36px",
        minWidth: props.minWidth,
        maxWidth: props.maxWidth,
        margin: props.margin,
        marginTop: props.marginTop,
        marginBottom: props.marginBottom,
        marginLeft: props.marginLeft,
        marginRight: props.marginRight,
        padding: props.padding,
        paddingTop: props.paddingTop,
        paddingBottom: props.paddingBottom,
        paddingLeft: props.paddingLeft,
        paddingRight: props.paddingRight,
        display: props.display,
        position: props.position,
        top: props.top,
        bottom: props.bottom,
        left: props.left,
        right: props.right,
        zIndex: props.zIndex,
        "& .MuiInputBase-root": {
          height: props.height || "36px",
          minHeight: props.minHeight,
          maxHeight: props.maxHeight,
          backgroundColor: props.backgroundColor || PRIMARY_LIGHT_GRAY,
          borderRadius: props.borderRadius || "8px",
          fontSize: props.fontSize || "12px",
          fontWeight: props.fontWeight,
          lineHeight: props.lineHeight,
          padding: "0 !important",
          "& fieldset": {
            border: "none",
          },
          "&:hover fieldset": {
            border: "none",
          },
          "&.Mui-focused fieldset": {
            border: "none",
          },
          "& input": {
            height: "100% !important",
            padding: "0 14px !important",
            color: props.color || "#18244E",
            "&::placeholder": {
              fontWeight: 600,
              letterSpacing: "5%",
              textAlign: "start",
              color: props.placeholderColor,
              opacity: 1,
              verticalAlign: "middle",
              lineHeight: "normal",
            },
          },
          "&:hover": {
            backgroundColor: props.hoverBackgroundColor,
          },
          "&.Mui-focused": {
            backgroundColor: props.focusBackgroundColor,
          },
          "&.Mui-disabled": {
            backgroundColor: props.disabledBackgroundColor,
            color: props.disabledColor,
          },
        },
        ...props.sx,
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholderText}
          sx={{
            border: props.border || `1.8px solid ${PRIMARY_BLUE2}`,
            borderRadius: props.borderRadius || "8px",
            height: "100%",
            "& .MuiInputBase-root": {
              height: "100%",
            },
            "&:hover": {
              border: props.hoverBorder,
            },
            "&:focus-within": {
              border: props.focusBorder || `1.8px solid ${PRIMARY_BLUE2}`,
              outline: "none",
            },
            "& .MuiInputBase-input::placeholder": {
              opacity: 1,
            },
          }}
        />
      )}
      {...props}
    />
  );
};

export default NuralAutocomplete;
