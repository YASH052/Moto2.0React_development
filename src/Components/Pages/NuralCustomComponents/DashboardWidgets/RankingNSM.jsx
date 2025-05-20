import React from "react";
import { Box, Typography, Paper, Stack, Divider } from "@mui/material";
import {
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
} from "../../../Common/colors";

const RankingNSM = ({ rankings = [] }) => {

  // console.log("rankings", rankings);
  // Filter rankings based on level
  const nsmRankings = rankings.filter((item) => item.level === "NSM");
  const rsmRankings = rankings.filter((item) => item.level === "RSM");
  // Assuming 'ISP' is the intended level, based on the data provided.
  // Adjust if the actual level key differs.
  const ispRankings = rankings.filter((item) => item.level === "ISP");

  const RankingSection = ({ rankings }) => (
    <Stack spacing={3}>
      {rankings.map((item) => (
        <Box
          key={item.rank}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography
              sx={{
                color: DARK_PURPLE,
                fontSize: "14px",
                fontWeight: 700,
                fontFamily: "Manrope",
              }}
            >
              #{item.rank}
            </Typography>
            <Typography
              sx={{
                color: DARK_PURPLE,
                fontSize: "10px",
                fontWeight: 700,
                fontFamily: "Manrope",
              }}
            >
              {item.rankName}
            </Typography>
          </Stack>
        </Box>
      ))}
    </Stack>
  );

  return (
    <Paper
      elevation={0}
      sx={{
        backgroundColor: LIGHT_GRAY2,
        borderRadius: "8px",
        padding: "24px",
        height: "auto",
        minHeight: "200px",
      }}
    >
      <Typography
        sx={{
          fontFamily: "Manrope",
          fontSize: "10px",
          fontWeight: 700,
          color: PRIMARY_BLUE2,
          letterSpacing: "0.04em",
          marginBottom: "20px",
        }}
      >
        Ranking
      </Typography>
      <Box
        sx={{
          display: "flex",
          // flexDirection: "column",
          gap: "20px",
        }}
      >
        {nsmRankings.length > 0 && (
          <Box>
             <Typography sx={{ mb: 1, fontWeight: 'bold', fontSize: '12px', color: DARK_PURPLE }}>NSM</Typography>
            <RankingSection rankings={nsmRankings} />
          </Box>
        )}
        {rsmRankings.length > 0 && (
          <Box>
             <Typography sx={{ mb: 1, fontWeight: 'bold', fontSize: '12px', color: DARK_PURPLE }}>RSM</Typography>
            <RankingSection rankings={rsmRankings} />
          </Box>
        )}
        {ispRankings.length > 0 && (
          <Box>
             <Typography sx={{ mb: 1, fontWeight: 'bold', fontSize: '12px', color: DARK_PURPLE }}>ISP</Typography>
            <RankingSection rankings={ispRankings} />
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default RankingNSM;
