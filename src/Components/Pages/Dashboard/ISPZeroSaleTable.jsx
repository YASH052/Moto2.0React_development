import React from "react";
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
} from "@mui/material";
import { DARK_BLUE, LIGHT_GRAY2 } from "../../Common/colors";

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

const ISPZeroSaleTable = () => {
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
          ISP Zero Sale Uploaded
        </Typography>
      </Box>
      <TableContainer sx={{ backgroundColor: LIGHT_GRAY2 }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: LIGHT_GRAY2 }}>
              <TableCell sx={RowStyles}>ISP</TableCell>
              <TableCell sx={RowStyles}>STORE</TableCell>
              <TableCell sx={RowStyles}>CITY</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dummyData.map((row, index) => (
              <TableRow key={index} sx={{ backgroundColor: LIGHT_GRAY2 }}>
                <TableCell sx={{ backgroundColor: LIGHT_GRAY2 }}>
                  <Typography variant="body2" sx={CellStyles}>
                    {row.name}
                  </Typography>
                  <Typography variant="body2" sx={CellStyles}>
                    {row.surname}
                  </Typography>
                </TableCell>
                <TableCell sx={CellStyles}>{row.storeName}</TableCell>
                <TableCell sx={CellStyles}>{row.cityName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ISPZeroSaleTable;
