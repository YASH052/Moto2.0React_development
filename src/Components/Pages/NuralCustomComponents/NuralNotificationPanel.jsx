import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  BLUE_COLOR,
  DARK_PURPLE,
  PRIMARY_LIGHT_PURPLE2,
  WHITE,
  WHITE_COLOR,
  LIGHT_BLUE,
  MEDIUM_BLUE,
  DARK_BLUE,
} from "../../Common/colors";

const getBackgroundColor = (variant) => {
  switch (variant) {
    case "dark":
      return DARK_BLUE;
    case "light":
      return LIGHT_BLUE;
    case "med-light":
      return MEDIUM_BLUE;
    default:
      return MEDIUM_BLUE;
  }
};

const getColor = (variant) => {
  switch (variant) {
    case "dark":
      return WHITE_COLOR;
    case "light":
      return DARK_PURPLE;
    case "med-light":
      return DARK_PURPLE;
    default:
      return WHITE_COLOR;
  }
};

const getBorder = (variant) => {
  switch (variant) {
    case "dark":
      return "1px solid rgba(255, 255, 255, 0.2)";
    default:
      return "none";
  }
};

const NotificationItem = styled(Paper)(({ theme, variant, customStyle }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(1),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  cursor: "pointer",
  transition: "background-color 0.2s",
  color: getColor(variant),
  backgroundColor: getBackgroundColor(variant),
  border: getBorder(variant),
  borderRadius: "8px",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
  "&.selected": {
    backgroundColor: getBackgroundColor(variant),
    color: getColor(variant),
  },
  ...(customStyle || {}),
}));

const NotificationIcon = styled(Box)(({ customStyle }) => ({
  width: 40,
  height: 40,
  borderRadius: 4,
  backgroundColor: "#e0e0e0",
  ...(customStyle || {}),
}));

const ArchiveText = styled(Typography)(({ customStyle }) => ({
  fontFamily: "Manrope",
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  fontSize: "8px",
  lineHeight: "10.93px",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: PRIMARY_LIGHT_PURPLE2,
  ...(customStyle || {}),
}));

const ArrowSpan = styled("span")(({ customStyle }) => ({
  display: "inline-block",
  width: "8px",
  height: "12px",
  fontSize: "12px",
  lineHeight: "12px",
  ...(customStyle || {}),
}));

const StatusDot = styled(Box)({
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  backgroundColor: "#4CAF50",
  marginRight: "8px",
});

const TimeText = styled(Typography)(({ customStyle }) => ({
  fontFamily: "Manrope",
  fontWeight: 700,
  fontSize: "8px",
  lineHeight: "10.93px",
  letterSpacing: "0.04em",
  opacity: 0.7,
  ...(customStyle || {}),
}));

const NotificationTitle = styled(Typography)(({ customStyle }) => ({
  fontFamily: "Manrope",
  fontWeight: 700,
  fontSize: "14px",
  lineHeight: "19.12px",
  letterSpacing: "0%",
  marginBottom: "8px",
  ...(customStyle || {}),
}));

const NuralNotificationPanel = ({
  notifications = [],
  width = "384px",
  height = "962px",
  backgroundColor = BLUE_COLOR,
  padding = "24px",
  margin,
  borderRadius = "12px",
  containerStyle = {},
  itemStyle = {},
  iconStyle = {},
  archiveStyle = {},
  arrowStyle = {},
  titleStyle = {},
  ...props
}) => {
  return (
    <Box
      sx={{
        width,
        height,
        backgroundColor,
        padding,
        margin,
        borderRadius,
        color: WHITE_COLOR,
        ...containerStyle,
      }}
      {...props}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontFamily: "Manrope",
            fontWeight: 700,
            fontSize: "20px",
            lineHeight: "27.32px",
            letterSpacing: "0%",
            ...titleStyle,
          }}
        >
          Notifications
        </Typography>

        <ArchiveText customStyle={archiveStyle}>
          Archive <ArrowSpan customStyle={arrowStyle}>{">"}</ArrowSpan>
        </ArchiveText>
      </Box>

      <Box sx={{ mb: 3 }}>
        {notifications.map((notification, index) => (
          <React.Fragment key={index}>
            <NotificationTitle>
              {notification.title}
            </NotificationTitle>
            <NotificationItem
              elevation={0}
              variant={notification.variant}
              className={notification.selected ? "selected" : ""}
              customStyle={itemStyle}
            >
              <NotificationIcon customStyle={iconStyle} />
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontSize: "14px",
                    fontWeight: 600,
                    lineHeight: "19.6px",
                    letterSpacing: "0.04em",
                  }}
                >
                  {notification.header}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    opacity: 0.7,
                    fontSize: "12px",
                    lineHeight: "16.8px",
                    letterSpacing: "0.04em",
                    fontWeight: 400,
                  }}
                >
                  {notification.subheader}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <TimeText>
                  {notification.time}
                </TimeText>
                &nbsp;
                {notification.title === "Today" && <StatusDot />}
              </Box>
            </NotificationItem>
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
};

export default NuralNotificationPanel;
