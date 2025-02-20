import React from "react";
import { Box, Button, Typography as MuiTypography } from "@mui/material";
import { styled } from "@mui/material/styles";

import AddIcon from "@mui/icons-material/Add";
import {
  ERROR_RED,
  ERROR_RED2,
  SUCCESS_GREEN,
  SUCCESS_GREEN2,
} from "../../Common/colors";

const StatusContainer = styled(Box)(({ status }) => ({
  backgroundColor:
    status === "failed"
      ? ERROR_RED
      : status === "warning"
      ? ERROR_RED
      : SUCCESS_GREEN,
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
      status === "failed"
        ? ERROR_RED2
        : status === "warning"
        ? ERROR_RED2
        : SUCCESS_GREEN,
  },
}));

const ActionButton = styled(Button)(({ status }) => ({
  width: "98%",
  height: "36px",
  backgroundColor: "transparent",
  border: `1px solid ${
    status === "failed"
      ? ERROR_RED2
      : status === "warning"
      ? ERROR_RED2
      : SUCCESS_GREEN2
  }`,
  borderRadius: "40px",
  padding: "8px 24px",
  color:
    status === "failed"
      ? ERROR_RED2
      : status === "warning"
      ? ERROR_RED2
      : SUCCESS_GREEN2,
  textTransform: "none",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
}));

const getStatusIcon = (status) => {
  switch (status) {
    case "failed":
      return <img src="./Icons/error.svg" alt="Error" />;
    case "warning":
      return <img src="./Icons/warning.svg" alt="Warning" />;
    default:
      return <img src="./Icons/success.svg" alt="Success" />;
  }
};

const getActionIcon = (status) => {
  switch (status) {
    case "warning":
      return (
        <img
          src="./Icons/Union.svg"
          alt="Union"
          style={{ width: "14px", height: "14px" }}
        />
      );
    default:
      return <AddIcon />;
  }
};

const StyledTypography = styled(MuiTypography)({
  fontFamily: "Manrope, sans-serif",
});

const NuralUploadStatus = ({
  status = "failed",
  title = "Upload Invalid",
  actionText = "CHECK FILE AND REUPLOAD",
  onAction,
  ...props
}) => {
  return (
    <StatusContainer
      status={status}
      sx={{
        width: props.width || "542px",
        height: props.height || "228px",
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
            status === "failed"
              ? ERROR_RED2
              : status === "warning"
              ? ERROR_RED2
              : SUCCESS_GREEN2,
          textAlign: "center",
        }}
      >
        {title}
      </StyledTypography>
      <IconWrapper margin="0px 0px 20px 0px" status={status}>
        {getStatusIcon(status)}
      </IconWrapper>

      {status != "success" && (
        <ActionButton status={status} onClick={onAction} sx={props.buttonSx}>
          {actionText}
          {getActionIcon(status)}
        </ActionButton>
      )}
    </StatusContainer>
  );
};

export default NuralUploadStatus;
