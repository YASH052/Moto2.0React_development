import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { DARK_BLUE, DARK_PURPLE, LIGHT_GRAY2 } from "../../Common/colors";

const dummyData = [
  {
    name: "Name",
    surname: "Surname",
    storeName: "Store Name",
    cityName: "City Name",
  },
  {
    name: "Name",
    surname: "Surname",
    storeName: "Store Name",
    cityName: "City Name",
  },
];

const RowStyles = {
  fontFamily: "Manrope",
  fontWeight: 700,
  fontSize: "10px",
  lineHeight: "100%",
  letterSpacing: "4%",
  textAlign: "start",
  color: DARK_BLUE,
  p: 2,
};

const CellStyles = {
  fontFamily: "Manrope",
  fontWeight: 400,
  fontSize: "10px",
  lineHeight: "100%",
  letterSpacing: "0%",
};

const ChannelRetailerList = ({channelRetailerValueList,channelRetailerQuantityList}) => {
  const [showValueData, setShowValueData] = useState(false);
  
  const displayData = showValueData ? channelRetailerValueList : channelRetailerQuantityList;
  
  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        borderRadius: "8px",
      }}
    >
      <Box sx={{ backgroundColor: LIGHT_GRAY2 }}>
        <Typography
          variant="h6"
          sx={{
            fontFamily: "Manrope",
            fontWeight: 700,
            fontSize: "10px",
            lineHeight: "100%",
            letterSpacing: "0%",
            color: DARK_BLUE,
            p: 2,
          }}
        >
          Retailer Performance
          <Button
            variant={!showValueData ? "contained" : "outlined"}
            size="small"
            onClick={() => setShowValueData(false)}
            sx={{
              backgroundColor: !showValueData ? DARK_PURPLE : LIGHT_GRAY2,
              color: !showValueData ? "#fff" : DARK_PURPLE,
              fontSize: "8px",
              fontWeight: 700,
              marginLeft: "80%",
              borderRadius: "40px",
              padding: "4px 12px",
              minWidth: "unset",
              border: !showValueData ? "none" : `1px solid ${DARK_PURPLE}`,
              "&:hover": {
                backgroundColor: "#2F3BC9",
                color: "#fff",
              },
            }}
          >
            QTY
          </Button>
          &nbsp; &nbsp; &nbsp;
          <Button
            size="small"
            variant={showValueData ? "contained" : "outlined"}
            onClick={() => setShowValueData(true)}
            sx={{
              backgroundColor: showValueData ? DARK_PURPLE : LIGHT_GRAY2,
              color: showValueData ? "#fff" : DARK_PURPLE,
              fontSize: "8px",
              fontWeight: 700,
              borderRadius: "40px",
              padding: "4px 12px",
              minWidth: "unset",
              border: showValueData ? "none" : `1px solid ${DARK_PURPLE}`,
              "&:hover": {
                backgroundColor: "#2F3BC9",
                color: "#fff",
              },
            }}
          >
            VAL
          </Button>
        </Typography>
      </Box>

      <TableContainer sx={{ backgroundColor: LIGHT_GRAY2 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: LIGHT_GRAY2 }}>
              <TableCell sx={RowStyles}>NAME</TableCell>
              <TableCell sx={RowStyles}>PRIMARY</TableCell>
              <TableCell sx={RowStyles}>TERTIARY</TableCell>
              <TableCell sx={RowStyles}>DRR</TableCell>
              <TableCell sx={RowStyles}>LMTD</TableCell>
              <TableCell sx={RowStyles}>M-1</TableCell>
              <TableCell sx={RowStyles}>M-2</TableCell>
              <TableCell sx={RowStyles}>M-3</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayData && displayData.map((row, index) => (
              <TableRow key={index} sx={{ backgroundColor: LIGHT_GRAY2 }}>
                <TableCell sx={{ backgroundColor: LIGHT_GRAY2 }}>
                  <Typography variant="body2" sx={CellStyles}>
                    {row.name}
                  </Typography>
                </TableCell>
                <TableCell sx={CellStyles}>{row.primary}</TableCell>
                <TableCell sx={CellStyles}>{row.tertiary}</TableCell>
                <TableCell sx={CellStyles}>{row.drr}</TableCell>
                <TableCell sx={CellStyles}>{row.lmtd}</TableCell>
                <TableCell sx={CellStyles}>{row.m_1}</TableCell>
                <TableCell sx={CellStyles}>{row.m_2}</TableCell>
                <TableCell sx={CellStyles}>{row.m_3}</TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ChannelRetailerList;
