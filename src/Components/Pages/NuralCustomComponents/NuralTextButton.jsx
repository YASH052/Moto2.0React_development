import React from "react";
import { Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DARK_PURPLE, PRIMARY_LIGHT_PURPLE } from "../../Common/colors";

const StyledButton = styled(Button)({
  textTransform: "none",
  padding: "12px 24px",
  borderRadius: "40px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  backgroundColor: "rgba(235, 238, 245, 0.5)",
  fontFamily: "Manrope, sans-serif",
  "&:hover": {
    backgroundColor: "rgba(235, 238, 245, 0.8)",
  },
});

const NuralTextButton = ({
  children,
  icon,
  iconPosition = "right",
  ...props
}) => {
  return (
    <StyledButton
      sx={{
        // Size
        width: props.width || "272px",
        height: props.height || "36px",
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
        padding: props.padding || "12px 24px",
        paddingTop: props.paddingTop,
        paddingBottom: props.paddingBottom,
        paddingLeft: props.paddingLeft,
        paddingRight: props.paddingRight,
        gap: props.gap || "8px",

        // Colors
        color: props.color || DARK_PURPLE,
        backgroundColor: props.backgroundColor || "#C6CEED",

        // Typography
        fontSize: props.fontSize || "12px",
        fontWeight: props.fontWeight || 700,
        lineHeight: props.lineHeight,
        letterSpacing: props.letterSpacing || "4%",

        // Hover state
        "&:hover": {
          backgroundColor: props.hoverBackgroundColor || PRIMARY_LIGHT_PURPLE,
          color: "#ffff",
          "& img": {
            filter: "brightness(0.8)",
          },
        },

        // Layout
        flexDirection: iconPosition === "right" ? "row" : "row-reverse",
        justifyContent: "center",

        // Icon styling
        "& img": {
          width: props.iconSize || "24px",
          height: props.iconSize || "15px",
          objectFit: "contain",
        },

        ...props.sx,
      }}
      {...props}
    >
      {children}
      <img src={icon} alt="img" />
    </StyledButton>
  );
};

export default NuralTextButton;
