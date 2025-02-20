import React from "react";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { PRIMARY_LIGHT_PURPLE, PRIMARY_BLUE2, AQUA_DARK } from "../../Common/colors";

const StyledButton = styled(Button)({
  textTransform: "none",
  boxShadow: "none",
  "&:hover": {
    boxShadow: "none",
  },
});

const NuralButton = ({ text, ...props }) => {
  return (
    <Button
      variant={props.variant || "outlined"}
      sx={{
        // Size
        width: props.width || "268px",
        minWidth: props.minWidth,
        maxWidth: props.maxWidth,
        height: props.height || "42px",
        minHeight: props.minHeight,
        maxHeight: props.maxHeight,
        gap: props.gap || "16px",

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

        // Styling
        backgroundColor: props.backgroundColor || "transparent",
        color: props.color || AQUA_DARK,
        border: props.border,
        borderRadius: props.borderRadius || "40px",
        borderColor: props.borderColor ||PRIMARY_BLUE2,
        // Text Styling
        fontFamily: props.fontFamily,
        fontSize: props.fontSize || "16px",
        fontWeight: props.fontWeight || 700,
        lineHeight: props.lineHeight || "21.86px",
        letterSpacing: props.letterSpacing || "0.04em",
        textAlign: props.textAlign || "center",

        // States
        "&:hover": {
          backgroundColor: props.hoverBackgroundColor || PRIMARY_LIGHT_PURPLE,
          border: props.hoverBorder,
          color: props.hoverColor || "#fff",
        },
        "&:focus": {
          backgroundColor: props.focusBackgroundColor,
          border: props.focusBorder,
          outline: "none",
        },
        "&:disabled": {
          backgroundColor: props.disabledBackgroundColor,
          border: props.disabledBorder,
          color: props.disabledColor,
        },
        ...props.sx
      }}
      {...props}
    >
        {text}
    </Button>
  );
};

export default NuralButton; 