import React from "react";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  DARK_PURPLE,
  LIGHT_GRAY2,
  MEDIUM_BLUE,
  PRIMARY_BLUE,
  PRIMARY_BLUE2,
} from "../../../Common/colors";

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: "12px",
  backgroundColor: LIGHT_GRAY2,
  boxShadow: "none",
}));

const StatBox = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginTop: "12px",
  borderTop: "1px solid #E0E0E0",
  paddingTop: "12px",
});

const StatItem = styled(Box)({
  textAlign: "center",
});

const AttendanceOverview = ({ data }) => {
  const present = parseInt(data.present);
  const total = parseInt(data.total);
  const percentage = (present / total) * 100;

  return (
    <StyledPaper>
      <Typography
        variant="h6"
        sx={{
          fontFamily: "Manrope",
          fontWeight: 700,
          fontSize: "10px",
          lineHeight: "13.66px",
          letterSpacing: "0%",
          color: PRIMARY_BLUE2,
          marginBottom: "12px",
        }}
      >
        Attendance Overview
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          gap: 4,
        }}
      >
        {/* Left side - Circle */}
        <Box
          sx={{
            position: "relative",
            width: "140px",
            height: "140px",
            flexShrink: 0,
          }}
        >
          <CircularProgress
            variant="determinate"
            value={percentage}
            size={140}
            thickness={4}
            sx={{
              color: PRIMARY_BLUE2,
              "& .MuiCircularProgress-circle": {
                strokeLinecap: "round",
              },
            }}
          />
          <CircularProgress
            variant="determinate"
            value={100}
            size={140}
            thickness={8}
            sx={{
              color: PRIMARY_BLUE2,
              position: "absolute",
              left: 0,
              top: 0,
              zIndex: -1,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                color: DARK_PURPLE,
                fontSize: "22px",
              }}
            >
              {`${present}/${total}`}
            </Typography>
            <Typography
              sx={{
                color: "#6B7A99",
                fontSize: "12px",
              }}
            >
              PRESENT
            </Typography>
          </Box>
        </Box>

        {/* Right side - Stats */}
        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <StatItem>
              <Typography
                sx={{
                  fontSize: "12px",
                  color: "#6B7A99",
                }}
              >
                TOTAL
              </Typography>
              <Typography
                sx={{
                  fontSize: "20px",
                  fontWeight: 600,
                  color: DARK_PURPLE,
                }}
              >
                {data.total}
              </Typography>
            </StatItem>
            <StatItem>
              <Typography
                sx={{
                  fontSize: "12px",
                  color: "#6B7A99",
                }}
              >
                ABSENT
              </Typography>
              <Typography
                sx={{
                  fontSize: "20px",
                  fontWeight: 600,
                  color: DARK_PURPLE,
                }}
              >
                {data.absent}
              </Typography>
            </StatItem>
          </Box>
          <hr
            style={{
              color: MEDIUM_BLUE,
            }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <StatItem>
              <Typography
                sx={{
                  fontSize: "12px",
                  color: "#6B7A99",
                }}
              >
                LEAVE
              </Typography>
              <Typography
                sx={{
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "#1C2437",
                }}
              >
                {data.leave}
              </Typography>
            </StatItem>
            <StatItem>
              <Typography
                sx={{
                  fontSize: "12px",
                  color: "#6B7A99",
                }}
              >
                OFF
              </Typography>
              <Typography
                sx={{
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "#1C2437",
                }}
              >
                {data.off}
              </Typography>
            </StatItem>
            <StatItem>
              <Typography
                sx={{
                  fontSize: "12px",
                  color: "#6B7A99",
                }}
              >
                CLOSED
              </Typography>
              <Typography
                sx={{
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "#1C2437",
                }}
              >
                {data.closed}
              </Typography>
            </StatItem>
          </Box>
        </Box>
      </Box>
    </StyledPaper>
  );
};

export default AttendanceOverview;
