import {
  LIGHT_GRAY2,
  DARK_PURPLE,
  PRIMARY_BLUE2,
  PRIMARY_LIGHT_GRAY,
  PRIMARY_BLUE,
  WHITE,
} from "./colors";

export const rowstyle = {
  // fontFamily: "Work Sans",
  fontWeight: 400,
  fontSize: "10px",
  lineHeight: "11.73px",
  letterSpacing: "0%",
  height: "29px",
  paddingTop: "4px",
  paddingBottom: "4px",
  borderBottom: "1px solid rgb(161, 175, 231)",
};

export const tableHeaderStyle = {
  fontFamily: "Manrope",
  fontWeight: 700,
  fontSize: "10px",
  lineHeight: "13.66px",

  letterSpacing: "4%",
  textAlign: "start",
  backgroundColor: LIGHT_GRAY2,
};

export const toggleSectionStyle = {
  width: 42,
  height: 24,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: "2px",
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(18px)",
      color: DARK_PURPLE,
      "& + .MuiSwitch-track": {
        backgroundColor: "#C6CEED",
        opacity: 1,
        border: 0,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 20,
    height: 20,
    backgroundColor: PRIMARY_BLUE2,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#C6CEED",
    opacity: 1,
  },
};

export const jumpToPageStyle = {
  width: "100px",
  height: "24px",
  paddingRight: "8px",
  paddingLeft: "8px",
  borderRadius: "8px",
  fontSize: "10px",
  borderWidth: "1px",
  textAlign: "center",
  border: `1px solid ${LIGHT_GRAY2}`,
  borderColor: PRIMARY_BLUE2,
  outline: "none",
};

export const titleStyle = {
  fontFamily: "Manrope",
  fontWeight: 700,
  fontSize: "14px",
  lineHeight: "100%",
  letterSpacing: "0%",
  color: DARK_PURPLE,
  marginBottom: "10px",
  mb: 3,
  mt: 1,
};

export const tablePaginationStyle = {
  padding: " 8px",

  alignItems: "center",
  justifyContent: "space-between",
  position: "sticky",
  bottom: 0,
  backgroundColor: LIGHT_GRAY2,
  borderTop: `1px solid ${PRIMARY_LIGHT_GRAY}`,
  zIndex: 1200,
  boxShadow: "0px -2px 4px rgba(0, 0, 0, 0.05)",
};

export const labelStyle = {
  fontSize: "10px",
  lineHeight: "13.66px",
  letterSpacing: "4%",
  color: DARK_PURPLE,
  marginBottom: "5px",
  fontWeight: 400,
};

export const headTitle = {
  fontFamily: "Manrope",
  fontWeight: 700,
  fontSize: "14px",
  lineHeight: "100%",
  letterSpacing: "0%",
  color: DARK_PURPLE,
  marginBottom: "10px",
  marginTop: "10px",
  // marginLeft: "10px",
  marginRight: "10px",
  mb: 3,
};
export const toggleButtonStyle = {
  fontSize: "8px",
  textTransform: "none",
  border: "none",
  padding: "4px", // Consistent padding
  // width: "36px", // Consistent width
  height: "27px", // Consistent height
  boxSizing: "border-box", // Ensure padding/border are included in width/height
  transition: "background-color 0.3s ease-in-out, color 0.3s ease-in-out",
  "&.Mui-selected": {
    backgroundColor: PRIMARY_BLUE,
    color: WHITE,
    borderRadius: "8px",
    // Explicitly define dimensions and padding to ensure consistency
    width: "36px",
    height: "27px",
    padding: "4px",
    "&:hover": {
      backgroundColor: PRIMARY_BLUE,
    },
  },
  "&:not(.Mui-selected)": {
    color: PRIMARY_BLUE,
    backgroundColor: "transparent",
    "&:hover": {
      backgroundColor: "transparent",
    },
  },
  "&:focus": {
    outline: "none",
  },
};

export const iconButtonStyle = {
  fontSize: 16,
  color: PRIMARY_BLUE2,
  "&:focus": {
    outline: "none",
  },
  size: "small",
};

export const checkboxStyle = {
  width: '20px',
  height: '20px',
  cursor: 'pointer',
  appearance: 'none',
  border: 'none',
  borderRadius: '6px',
  backgroundColor: '#fff',
  padding: 0,
  margin: 0,
  position: 'absolute',
  top: 0,
  left: 0,
  // boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)'
}
