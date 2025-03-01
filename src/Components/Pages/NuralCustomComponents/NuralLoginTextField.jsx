import React, { useState } from "react";
import { Box, InputBase, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { DARK_PURPLE, ERROR_MSSG, ERROR_RED } from "../../Common/colors";

const StyledInputContainer = styled(Box)({
  position: "relative",
  width: "100%",
  backgroundColor: "#fff",
  borderRadius: "8px",
  overflow: "hidden",
});

const StyledInput = styled(InputBase)({
  width: "100%",
  padding: "12px 16px",
  fontSize: "14px",
  fontFamily: "Manrope, sans-serif",
  color: DARK_PURPLE,
  "&::placeholder": {
    color: "rgba(67, 44, 129, 0.5)",
    opacity: 1,
  },
  "& .MuiInputBase-input": {
    padding: 0,
  },
});

const StyledIconButton = styled(IconButton)({
  position: "absolute",
  right: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  padding: "4px",
  color: DARK_PURPLE,
});

const StyledErrorIcon = styled(IconButton)({
  position: "absolute",
  right: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  padding: "4px",
  "&:hover": {
    backgroundColor: "transparent",
    cursor: "default",
  },
});

const NuralLoginTextField = ({
  type = "text",
  placeholder = "Enter text",
  value,
  onChange,
  error = false,
  errorMessage = "",
  maxLength,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box>
      <StyledInputContainer
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

          // Border
          border: error ? "1px solid #FF0000" : (props.border || "1px solid gray"),
          borderRadius: props.borderRadius || "8px",
          borderColor: error ? "#FF0000" : props.borderColor,
          borderWidth: props.borderWidth,
          borderStyle: props.borderStyle,

          // Colors
          backgroundColor: error ? "#FFF2F2" : (props.backgroundColor || "#fff"),

          // Other
          boxShadow: props.boxShadow,
          ...props.sx,

          // Add error transition
          transition: "all 0.3s ease",
        }}
      >
        <StyledInput
          type={isPassword ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          inputProps={{
            maxLength: maxLength,
            style: {
              fontSize: props.fontSize || "14px",
              fontWeight: props.fontWeight || 400,
              color: error ? ERROR_RED : (props.color || DARK_PURPLE),
              ...props.inputStyle,
            },
          }}
          sx={{
            ...props.inputSx,
            paddingRight: error && !isPassword ? "40px" : isPassword ? "40px" : "16px",
          }}
        />
        {error && !isPassword && (
          <StyledErrorIcon
            disableRipple
            sx={{
              color: ERROR_RED,
              ...props.errorIconSx,
            }}
          >
            <ErrorOutlineIcon sx={{ fontSize: "20px" }} />
          </StyledErrorIcon>
        )}
        {isPassword && (
          <StyledIconButton
            onClick={handleTogglePassword}
            sx={{
              ...props.iconButtonSx,
              color: error ? ERROR_RED : DARK_PURPLE,
              right: error ? "36px" : "12px",
            }}
          >
            {showPassword ? (
              <VisibilityOffIcon sx={{ fontSize: "20px" }} />
            ) : (
              <VisibilityIcon sx={{ fontSize: "20px" }} />
            )}
          </StyledIconButton>
        )}
        {error && isPassword && (
          <StyledErrorIcon
            disableRipple
            sx={{
              color: ERROR_RED,
              ...props.errorIconSx,
            }}
          >
            <ErrorOutlineIcon sx={{ fontSize: "20px" }} />
          </StyledErrorIcon>
        )}
      </StyledInputContainer>
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

export default NuralLoginTextField; 