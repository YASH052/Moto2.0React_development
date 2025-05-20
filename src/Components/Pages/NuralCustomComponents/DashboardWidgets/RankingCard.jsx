import React from "react";
import { Card, Typography, Box } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DARK_PURPLE, LIGHT_GRAY2 } from "../../../Common/colors";

const RankContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  "&:last-child": {
    marginBottom: 0,
  },
}));

const RankNumber = styled(Typography)(({ theme }) => ({
  color: "#00D1C1",
  fontWeight: "700",
  fontSize: "14px",
  lineHeight: "1.2",
}));

const RankLabel = styled(Typography)(({ theme }) => ({
  color: "#637381",
  fontSize: "8px",
  fontWeight: "400",
  textTransform: "uppercase",
  marginTop: theme.spacing(.7),
}));

const RankingCard = ({
  data,
  height = "auto",
  backgroundColor = "#FFFFFF",
  cardStyles = {
    paddingY: 1,
    paddingX: 2,
    borderRadius: 2,
    // width: "144px",
  },
}) => {
  console.log("data", data);
  return (
    <Card sx={{ ...cardStyles, backgroundColor }}>
      <Typography
        variant="h6"
        sx={{
          color: "#0B4B66",
          fontWeight: 600,
          fontSize: "12px",
          mb:1.8,
        }}
      >
        My Rank
      </Typography>

      <RankContainer>
        <RankNumber>#{data[0]?.regionRank || 0}</RankNumber>
        <RankLabel>REGION</RankLabel>
      </RankContainer>

      <RankContainer>
        <RankNumber>#{data[0]?.areaRank || 0}</RankNumber>
        <RankLabel>AREA</RankLabel>
      </RankContainer>

      <RankContainer>
        <RankNumber>#{data[0]?.nationRank || 0}</RankNumber>
        <RankLabel>NATIONAL</RankLabel>
      </RankContainer>
    </Card>
  );
};

export default RankingCard;
