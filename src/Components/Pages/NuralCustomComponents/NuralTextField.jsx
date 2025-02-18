import React from "react";
import { TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import { PRIMARY_LIGHT_GRAY, PRIMARY_LIGHT_PURPLE } from "../../Common/colors";

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "#F8F9FC",
    borderRadius: "8px",
    "& fieldset": {
      border: "none",
    },
    "&:hover fieldset": {
      border: "none",
    },
    "&.Mui-focused fieldset": {
      border: "none",
    },
  },
  "& .MuiOutlinedInput-input": {
    padding: "8px 14px",
    lineHeight: "normal",
    "&::placeholder": {
      lineHeight: "normal",
      verticalAlign: "middle",
    },
  },
});

const NuralTextField = ({ ...props }) => {
  return (
    <StyledTextField
      sx={{
        width: props.width || "232px",
        minWidth: props.minWidth,
        maxWidth: props.maxWidth,
        height: props.height || "36px",
        minHeight: props.minHeight,
        maxHeight: props.maxHeight,
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
        border: props.border || `1.8px solid ${PRIMARY_LIGHT_PURPLE}`,
        borderRadius: props.borderRadius || "8px",
        backgroundColor: props.backgroundColor || PRIMARY_LIGHT_GRAY,
        color: props.color,
        fontSize: props.fontSize,
        fontWeight: props.fontWeight,
        textAlign: props.textAlign,
        "&:focus-within": {
          outline: "none",
          border: props.focusBorder || `1.8px solid ${PRIMARY_LIGHT_PURPLE}`,
          backgroundColor: props.focusBackgroundColor,
        },
        "&:hover": {
          border: props.hoverBorder,
          backgroundColor: props.hoverBackgroundColor,
        },
        "&:disabled": {
          border: props.disabledBorder,
          backgroundColor: props.disabledBackgroundColor,
          color: props.disabledColor,
        },
        "& .MuiInputBase-root": {
          height: "100%",
        },
        "& .MuiOutlinedInput-input": {
          height: "100%",
          padding: props.inputPadding || "0 14px",
        },
        ...props.sx,
      }}
      placeholder={props.placeholder || "Enter text here..."}
      {...props}
    />
  );
};

export default NuralTextField;
