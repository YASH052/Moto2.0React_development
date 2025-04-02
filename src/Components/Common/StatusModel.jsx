import React from "react";
import { Box, Typography as MuiTypography } from "@mui/material";
import { styled } from "@mui/material/styles";

import { ERROR_RED, ERROR_RED2, SUCCESS_GREEN, SUCCESS_GREEN2 } from "./colors";

const StatusContainer = styled(Box)(({ status }) => ({
  backgroundColor:
    status == "200"
      ? SUCCESS_GREEN
      : status == "400" || status == "404" || status == "401"
      ? ERROR_RED
      : ERROR_RED,
  borderRadius: "8px",
  padding: "24px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "16px",
}));

const IconWrapper = styled(Box)(({ status }) => ({
  width: "48px",
  height: "48px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& svg": {
    width: "32px",
    height: "32px",
    color:
      status == "200"
        ? SUCCESS_GREEN
        : status == "400" || status == "404" || status == "401"
        ? ERROR_RED
        : ERROR_RED,
  },
}));

const getStatusIcon = (status) => {
  const statusStr = String(status);
  switch (statusStr) {
    case "200":
      return <img src="./Icons/success.svg" alt="Success" />;
    case "400":
      return <img src="./Icons/error.svg" alt="Error" />;
    case "404":
      return <img src="./Icons/error.svg" alt="Error" />;
    case "401":
      return <img src="./Icons/error.svg" alt="Error" />;
    case "500":
      return <img src="./Icons/error.svg" alt="Error" />;
    default:
      return <img src="./Icons/success.svg" alt="Success" />;
  }
};

const StyledTypography = styled(MuiTypography)({
  fontFamily: "Manrope, sans-serif",
});

const StatusModel = ({
  status = "200",
  title = "Upload Invalid",
  onAction,
  ...props
}) => {
  return (
    <StatusContainer
      status={status}
      sx={{
        width: props.width || "542px",
        height: props.height || "175px",
        margin: props.margin,
        padding: props.padding,
        borderRadius: props.borderRadius || "8px",
        gap: props.gap || "16px",
        paddingTop: props.paddingTop || "16px",
        paddingRight: props.paddingRight || "8px",
        paddingBottom: props.paddingBottom || "16px",
        paddingLeft: props.paddingLeft || "8px",
        ...props.sx,
      }}
    >
      <StyledTypography
        sx={{
          margin: "20px 0px 20px 0px",
          fontSize: props.titleFontSize || "16px",
          fontWeight: props.titleFontWeight || 600,
          color:
            status == "200"
              ? SUCCESS_GREEN2
              : status == "400" || status == "404" || status == "401"
              ? ERROR_RED2
              : ERROR_RED2,
          textAlign: "center",
        }}
      >
        {title}
      </StyledTypography>
      <IconWrapper margin="0px 0px 20px 0px" status={status}>
        {getStatusIcon(status)}
      </IconWrapper>
    </StatusContainer>
  );
};

export default StatusModel;
