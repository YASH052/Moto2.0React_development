import { useState } from "react";
import PropTypes from 'prop-types';
import { TextField, Typography, Box, InputAdornment, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { PRIMARY_LIGHT_GRAY, PRIMARY_LIGHT_PURPLE, ERROR_RED, ERROR_MSSG, PRIMARY_BLUE2 } from "../../Common/colors";

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

const NuralTextField = ({ error, errorMessage, helperText, type, sx, ...props }) => {
  const errorBorderColor = ERROR_RED;
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const isPassword = type === 'password';
  const currentType = isPassword ? (showPassword ? 'text' : 'password') : type;
  const paddingRightValue = error && isPassword ? '70px' : (error || isPassword ? '40px' : '14px');
  
  return (
    <Box sx={{ position: "relative", width: props.width || "232px" }}>
      <Box sx={{ position: "relative" }}>
        <StyledTextField
          type={currentType}
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
              paddingRight: paddingRightValue,
              color: error ? ERROR_RED : "inherit",
            },
            "&.MuiOutlinedInput-root": {
              fontSize: "10px",
            },
            transition: "all 0.3s ease",
            ...sx,
          }}
          error={error}
          placeholder={props.placeholder || "Enter text here..."}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end" sx={{ position: 'absolute', right: error ? '40px' : '12px' }}>
                {isPassword && (
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    sx={{ color: error ? ERROR_RED : PRIMARY_BLUE2 }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                )}
              </InputAdornment>
            )
          }}
          {...props}
        />
        {error && (
          <StyledErrorIcon sx={{ right: isPassword ? '40px' : '12px' }}>
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

NuralTextField.propTypes = {
  error: PropTypes.bool,
  errorMessage: PropTypes.string,
  type: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  minWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  minHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  margin: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  marginTop: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  marginBottom: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  marginLeft: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  marginRight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  padding: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  paddingTop: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  paddingBottom: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  paddingLeft: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  paddingRight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  display: PropTypes.string,
  position: PropTypes.string,
  top: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  bottom: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  left: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  right: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  zIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  border: PropTypes.string,
  borderRadius: PropTypes.string,
  backgroundColor: PropTypes.string,
  color: PropTypes.string,
  fontSize: PropTypes.string,
  fontWeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  textAlign: PropTypes.string,
  focusBorder: PropTypes.string,
  focusBackgroundColor: PropTypes.string,
  hoverBorder: PropTypes.string,
  hoverBackgroundColor: PropTypes.string,
  disabledBorder: PropTypes.string,
  disabledBackgroundColor: PropTypes.string,
  disabledColor: PropTypes.string,
  inputPadding: PropTypes.string,
  placeholder: PropTypes.string,
  sx: PropTypes.object,
};

export default NuralTextField;