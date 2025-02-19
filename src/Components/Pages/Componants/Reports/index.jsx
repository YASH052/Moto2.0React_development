import React from "react";
import { useNavigate } from "react-router-dom";
import { Constant } from "../../../Common/Constant";
import PageHeader from "../../../Common/PageHeader";
import { Grid, Typography, Box, IconButton } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import DescriptionIcon from "@mui/icons-material/Description";
import {
  PRIMARY_BLUE,
  DARK_BLUE,
  WHITE,
  LIGHT_GRAY2,
} from "../../../Common/colors";

const reportData = [
  {
    title: "Sales",
    reports: [
      { name: "SALES REPORT", path: "/sales-report" },
      { name: "ISP SALES REPORT", path: "/isp-sales-report" },
      { name: "UNIQUE SALES REPORT", path: "/unique-sales-report" },
      { name: "PRIMARY TO TERTIARY TRACK", path: "/primary-tertiary-track" },
    ],
    reports2: [
      { name: "COMPETITION SALES REPORT", path: "/competition-sales" },
    ],
  },
  {
    title: "Stock",
    reports: [
      { name: "STOCK REPORT", path: "/stock-report" },
      { name: "SALESCHANNEL STOCK SB", path: "/saleschannel-stock" },
      { name: "STOCK ADJUSTMENT REPORT", path: "/stock-adjustment" },
    ],
    reports2: [],
  },
  {
    title: "App",
    reports: [
      { name: "L&D ASSESSMENT REPORT", path: "/ld-assessment" },
      { name: "FEEDBACK REPORT", path: "/feedback-report" },
      { name: "MERCHANDIZING REPORT", path: "/merchandizing-report" },
      { name: "SURVEY REPORT", path: "/survey-report" },
    ],
    reports2: [{ name: "PRE BOOKING REPORT", path: "/pre-booking" }],
  },
  {
    title: "Retail",
    reports: [
      { name: "DEMO AUDIT REPORT", path: "/demo-audit" },
      { name: "FIXTURE AUDIT REPORT", path: "/fixture-audit" },
      { name: "VISIBILITY AUDIT REPORT", path: "/visibility-audit" },
      { name: "COMPETITION ASSET REPORT", path: "/competition-asset" },
    ],
    reports2: [
      { name: "DEMO PRODUCTIVITY REPORT", path: "/demo-productivity" },
    ],
  },
];

const Reports = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ width: "98%", display: "block" }}>
        <PageHeader title={Constant.Reports} />
      </Box>

      <Box sx={{ width: "98%", padding: "16px", marginTop: "16px" }}>
        <Grid container spacing={2}>
          {reportData.map((item, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Box
                sx={{
                  backgroundColor: LIGHT_GRAY2,
                  color: DARK_BLUE,
                  padding: "20px",
                  borderRadius: "12px",
                  position: "relative",
                  minHeight: "180px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {/* ✅ Icon Clickable */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    outline: "none",
                  }}
                >
                  <IconButton
                    disableRipple
                    sx={{
                      outline: "none",
                      "&:focus": { outline: "none" },
                      "&:focusVisible": { outline: "none" },
                    }}
                  >
                    <DescriptionIcon sx={{ fontSize: 70, color: DARK_BLUE }} />
                  </IconButton>
                </Box>

                {/* ❌ Title Not Clickable */}
                <Typography
                  sx={{
                    fontWeight: "bold",
                    fontSize: "24px",
                    color: DARK_BLUE,
                  }}
                >
                  {item.title}
                </Typography>

                {/* ✅ Reports Clickable (Stock ke liye 1 Column, Baaki ke liye 2 Columns) */}
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                      item.title === "Stock" ? "1fr" : "repeat(2, 1fr)",
                    gap: "8px",
                  }}
                >
                  {item.reports.map((report, i) => (
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        cursor: "pointer",
                      }}
                      onClick={() => navigate(report.path)}
                    >
                      <Typography>{report.name}</Typography>
                      <ArrowForwardIosIcon sx={{ fontSize: 20 }} />
                    </Box>
                  ))}
                </Box>

                {/* ✅ Additional Reports */}
                {item.reports2.length > 0 && (
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns:
                        item.title === "Stock" ? "1fr" : "repeat(2, 1fr)",
                      gap: "8px",
                    }}
                  >
                    {item.reports2.map((report, i) => (
                      <Box
                        key={i}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          cursor: "pointer",
                        }}
                        onClick={() => navigate(report.path)}
                      >
                        <Typography>{report.name}</Typography>
                        <ArrowForwardIosIcon sx={{ fontSize: 16 }} />
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Reports;
