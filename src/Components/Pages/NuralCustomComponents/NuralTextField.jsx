import React from "react";
import { TextField, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { PRIMARY_LIGHT_GRAY, PRIMARY_LIGHT_PURPLE, ERROR_RED, ERROR_MSSG } from "../../Common/colors";

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
    padding: "8px",
    lineHeight: "normal",
    "&::placeholder": {
      lineHeight: "normal",
      verticalAlign: "middle",
      fontFamily: "Manrope",
      fontWeight: 400,
      fontSize: "12px",
      lineHeight: "16.39px",
      letterSpacing: "4%",
      textTransform: "capitalize",
    },
  },
});

const StyledErrorIcon = styled(Box)({
  position: "absolute",
  right: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  display: "flex",
  alignItems: "center",
  color: ERROR_RED,
  pointerEvents: "none",
});

const NuralTextField = ({ error, helperText, errorMessage, ...props }) => {
  const errorBorderColor = ERROR_RED;
  
  return (
    <Box sx={{ position: "relative", width: props.width || "232px" }}>
      <Box sx={{ position: "relative" }}>
        <StyledTextField
          sx={{
            width: "100%",
            height: props.height || "36px",
            minWidth: props.minWidth,
            maxWidth: props.maxWidth,
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
            border: error 
              ? `1.8px solid ${errorBorderColor}` 
              : props.border || `1.8px solid ${PRIMARY_LIGHT_PURPLE}`,
            borderRadius: props.borderRadius || "8px",
            backgroundColor: error ? "#FFF2F2" : (props.backgroundColor || PRIMARY_LIGHT_GRAY),
            color: props.color,
            fontSize: props.fontSize,
            fontWeight: props.fontWeight,
            textAlign: props.textAlign,
            "&:focus-within": {
              outline: "none",
              border: error 
                ? `1.8px solid ${errorBorderColor}` 
                : props.focusBorder || `1.8px solid ${PRIMARY_LIGHT_PURPLE}`,
              backgroundColor: error ? "#FFF2F2" : props.focusBackgroundColor,
            },
            "&:hover": {
              border: error ? `1.8px solid ${errorBorderColor}` : props.hoverBorder,
              backgroundColor: error ? "#FFF2F2" : props.hoverBackgroundColor,
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
              paddingRight: error ? "40px" : "14px",
              color: error ? ERROR_RED : "inherit",
            },
            "&.MuiOutlinedInput-root": {
              fontSize: "10px",
            },
            transition: "all 0.3s ease",
            ...props.sx,
          }}
          error={error}
          placeholder={props.placeholder || "Enter text here..."}
          {...props}
        />
        {error && (
          <StyledErrorIcon>
            <ErrorOutlineIcon sx={{ fontSize: "20px" }} />
          </StyledErrorIcon>
        )}
      </Box>
      {error && errorMessage && (
        <Typography
          sx={{
            color: ERROR_MSSG,
            fontSize: "12px",
            marginTop: "4px",
            fontFamily: "Manrope, sans-serif",
            paddingLeft: "8px",
          }}
        >
          {errorMessage}
        </Typography>
      )}
    </Box>
  );
};

export default NuralTextField;
