import React from "react";
import styled from "styled-components";
import { PRIMARY_BLUE2, DARK_PURPLE } from "../../Common/colors";
import { Box, Typography } from "@mui/material";

const QuickLinksContainer = styled.div`
  margin-top: 0px;
  padding: 0 8px;
`;



const NuralQuickLinks = ({ links, onLinkClick }) => {
  return (
    <QuickLinksContainer>
     
      {links.map((link, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "5px 0px 12px 0px",
            color: DARK_PURPLE,

            borderRadius: "4px",
          }}
        >
          <img src="./Icons/Rect.svg" alt="img" />
          <Typography
            style={{
              fontFamily: "Manrope",
              fontSize: "12px",
              fontWeight: "700",
              lineHeight: "16.39px",
              letterSpacing: "0%",
              color: DARK_PURPLE,
            }}
          >
            {link.label || link}
          </Typography>
        </Box>
      ))}
    </QuickLinksContainer>
  );
};

export default NuralQuickLinks;
