import React from "react";
import { Box, Typography, Paper, Stack, Divider } from "@mui/material";
import {
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
} from "../../../Common/colors";

const RankingNSM = () => {
  const nsmRankings = [
    { rank: 1, title: "NSM 1", scr: 340, zero: 120 },
    { rank: 2, title: "NSM 2", scr: 340, zero: 120 },
    { rank: 3, title: "NSM 3", scr: 340, zero: 120 },
  ];

  const rsmRankings = [
    { rank: 1, title: "RSM 1", scr: 340, zero: 120 },
    { rank: 2, title: "RSM 2", scr: 340, zero: 120 },
    { rank: 3, title: "RSM 3", scr: 340, zero: 120 },
  ];

  const ispRankings = [
    { rank: 1, title: "ISP 1", scr: 340, zero: 120 },
    { rank: 2, title: "ISP 2", scr: 340, zero: 120 },
    { rank: 3, title: "ISP 3", scr: 340, zero: 120 },
  ];

  const RankingSection = ({ rankings }) => (
    <Stack spacing={2.5}>
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
                fontSize: "14px",
                fontWeight: 700,
                fontFamily: "Manrope",
              }}
            >
              {item.title}
            </Typography>
          </Stack>
          <Typography
            sx={{
              color: DARK_PURPLE,
              fontSize: "8px",
              fontFamily: "Manrope",
              fontWeight: 500,
              letterSpacing: "0.04em",
            }}
          >
            SCR : <span style={{ fontWeight: 700 }}>{item.scr}</span> | ZERO :{" "}
            <span style={{ fontWeight: 700 }}>{item.zero}</span>
          </Typography>
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
        height: "200px",
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
        Ranking [NSM]
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "24px",
        }}
      >
        <Box>
          <RankingSection rankings={nsmRankings} />
        </Box>
        <Box
          sx={{
            borderLeft: `1px solid rgba(0, 0, 0, 0.12)`,
            paddingLeft: "24px",
          }}
        >
          <RankingSection rankings={rsmRankings} />
        </Box>
        <Box
          sx={{
            borderLeft: `1px solid rgba(0, 0, 0, 0.12)`,
            paddingLeft: "24px",
          }}
        >
          <RankingSection rankings={ispRankings} />
        </Box>
      </Box>
    </Paper>
  );
};

export default RankingNSM;
