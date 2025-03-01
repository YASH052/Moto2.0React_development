import React from "react";
import { Card, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DARK_PURPLE, LIGHT_GRAY2 } from "../../../Common/colors";

const RankContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  marginBottom: theme.spacing(0.5),
  padding: theme.spacing(0.25, 1),
  "&:last-child": {
    marginBottom: 0,
  },
}));

const RankNumber = styled(Typography)(({ theme, rankNumberColor }) => ({
  color: rankNumberColor || "#4267B2",
  fontWeight: "bold",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const InfoCard = ({
  data = [],
  title,
  dateRange,
  // Style props with default values
  cardStyles = {
    padding: 1.5,
    borderRadius: 2,
    width: "200px",
    backgroundColor: LIGHT_GRAY2,
  },
  titleStyles = {
    ml: 0.5,
    fontFamily: "Manrope",
    fontWeight: 700,
    fontSize: "10px",
    lineHeight: "13.66px",
    color: DARK_PURPLE,
  },
  dateStyles = {
    color: "#6B7280",
    fontSize: "10px",
  },
  rankContainerStyles = {
    gap: "0px",
    my: -0.1,
    mb: 0.5,
  },
  rankNumberStyles = {
    fontFamily: "Manrope",
    fontWeight: 700,
    fontSize: "20px",
    lineHeight: "24px",
  },
  scoreStyles = {
    fontFamily: "Manrope",
    fontWeight: 400,
    fontSize: "10px",
    lineHeight: "13.66px",
    letterSpacing: "4%",
    textAlign: "start",
  },
  rankNumberColor,
}) => {
  return (
    <Card sx={{ ...cardStyles }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1.5
        }}
      >
        <Typography variant="h6" sx={{ ...titleStyles }}>
          {title}
        </Typography>
        {dateRange && (
          <Typography variant="caption" sx={{ ...dateStyles }}>
            {dateRange}
          </Typography>
        )}
      </Box>
      {data.map((item, index) => (
        <RankContainer key={index} sx={{ ...rankContainerStyles }}>
          <RankNumber
            variant="body1"
            rankNumberColor={rankNumberColor}
            sx={{ ...rankNumberStyles }}
          >
            {/* <span>#{index + 1}</span> */}
            <span>{item.name}</span>
          </RankNumber>
          <Typography variant="body2" sx={{ ...scoreStyles }}>
            {item.score}
          </Typography>
        </RankContainer>
      ))}
    </Card>
  );
};

export default InfoCard;
