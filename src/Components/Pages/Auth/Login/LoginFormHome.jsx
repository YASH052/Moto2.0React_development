import { Box, Grid, Typography } from "@mui/material";
import React from "react";
import one from "../../../../assets/carousel/one.png";
import two from "../../../../assets/carousel/two.png";
import three from "../../../../assets/carousel/three.png";
import four from "../../../../assets/carousel/Four.png";
import five from "../../../../assets/carousel/five.png";
import pdcard from "../../../../assets/carousel/pdcard.png";
// import logo from "../../../../assets/logo/Symbol.png";
import { AQUA, PRIMARY_BLUE } from "../../../Common/colors";
import { useMediaQuery } from "@mui/material";
const images = [pdcard, one, two, five, four, three];

const LoginFormHome = () => {
    const isLargeScreen = useMediaQuery("(min-width:512px)");
  return (
    <>
      <Box
        sx={{
          marginTop: "2%",
          marginLeft: "20%",
          color: PRIMARY_BLUE,
        }}
      >
        Welcome to
      </Box>
      <Box
        sx={{
          //   width: "100%",
          height: "15%",
          display: "flex",
          marginLeft: "20%",
          alignItems: "center",
          fixed: "middle",
        }}
      >
        <img
          src="/Images/Symbol.png"
          alt="logo"
          style={{ maxWidth: "90px" }} // Adjust image size as needed
        />

        <img
          src="/Images/Frame 4.png"
          alt="logo"
          style={{ maxWidth: "150px", marginLeft: "30px" }} // Adjust image size as needed
        />
        <Box
          sx={{
            height: "100%", // Adjust height of the line
            width: "1px", // Adjust width of the line
            backgroundColor: PRIMARY_BLUE, // Color of the line
            marginLeft: "50px",
          }}
        />
        {isLargeScreen && (
        <Grid
          sx={{
            color: PRIMARY_BLUE,
            fontSize: "36px",
            padding: "10px",
            textAlign: "center",
          }}
        >
          Your unified platform for sales operations
        </Grid>)}
      </Box>
      <Grid
        sx={{
          color: PRIMARY_BLUE,
          fontSize: "36px",
          padding: "0px",
          textAlign: "center",
        }}
      >
        <Typography 
        fontSize={24}
        marginTop="1%"
        marginBottom="0%"
        >Select Your Nural Application<hr></hr></Typography>
      </Grid>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          marginBottom: "4%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)", // 3 images per row
            gap: 2, // Space between images
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {images.map((img, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent: "center",
                cursor: "pointer",
                alignItems: "center",
              }}
            >
              <img
                src={img}
                alt={`Slide ${index}`}
                style={{
                  width: "100%",
                  objectFit: "cover",
                  borderRadius: "10px",
                }}
              />
            </Box>
          ))}
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "4px",
        }}
      >
        <Grid
          container
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            backgroundColor: AQUA,
            textAlign: "center",
            padding: "0px",
          }}
        >
          <Grid item xs={12}>
            <img
              src="/Images/NuralFootLogo.png"
              alt="logo"
              style={{ width: "180px" }} // Adjust image size as needed
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default LoginFormHome;
