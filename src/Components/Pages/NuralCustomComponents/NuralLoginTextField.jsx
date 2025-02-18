import React, { useState } from "react";
import { Box, InputBase, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { DARK_PURPLE } from "../../Common/colors";

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

const NuralLoginTextField = ({
  type = "text",
  placeholder = "Enter text",
  value,
  onChange,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
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
        border: props.border ||"1px solid gray",
        borderRadius: props.borderRadius || "8px",
        borderColor: props.borderColor,
        borderWidth: props.borderWidth,
        borderStyle: props.borderStyle,

        // Colors
        backgroundColor: props.backgroundColor || "#fff",

        // Other
        boxShadow: props.boxShadow,
        ...props.sx,
      }}
    >
      <StyledInput
        type={isPassword ? (showPassword ? "text" : "password") : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        sx={props.inputSx}
        inputProps={{
          style: {
            fontSize: props.fontSize || "14px",
            fontWeight: props.fontWeight || 400,
            color: props.color || DARK_PURPLE,
            ...props.inputStyle,
          },
        }}
      />
      {isPassword && (
        <StyledIconButton
          onClick={handleTogglePassword}
          sx={props.iconButtonSx}
        >
          {showPassword ? (
            <VisibilityOffIcon sx={{ fontSize: "20px" }} />
          ) : (
            <VisibilityIcon sx={{ fontSize: "20px" }} />
          )}
        </StyledIconButton>
      )}
    </StyledInputContainer>
  );
};

export default NuralLoginTextField; 