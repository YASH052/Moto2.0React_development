import React from "react";
import  { BORDER_BOTTOM, DARK_PURPLE } from '../Common/colors'

const PageHeader = ({ title }) => {
  console.log("Border Color:", BORDER_BOTTOM);
  return (
    <div style={{
      width: "100%",
      margin: "20px",
      fontSize: "24px",
      fontWeight: "bold",
      padding: "10px 0",
      color: DARK_PURPLE,
      borderBottom: `2px solid ${DARK_PURPLE}`, 
      marginBottom: "20px"
    }}>
      {title}
    </div>
  );
};

export default PageHeader;
