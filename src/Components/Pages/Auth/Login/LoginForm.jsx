import React, { useState } from "react";
import { Box, Grid, Typography, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import NuralLoginTextField from "../../NuralCustomComponents/NuralLoginTextField";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import {
  AQUA,
  GREEN_COLOR,
  LIGHT_GRAY2,
  MEDIUM_BLUE,
  PRIMARY_BLUE,
  WHITE,
} from "../../../Common/colors";
import pdcard from "../../../../assets/carousel/pdcard.png";
import one from "../../../../assets/carousel/one.png";
import two from "../../../../assets/carousel/two.png";
import three from "../../../../assets/carousel/three.png";
import four from "../../../../assets/carousel/Four.png";
import five from "../../../../assets/carousel/five.png";

const LoginForm = () => {
  const [accessKey, setAccessKey] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const isLargeScreen = useMediaQuery("(min-width:512px)");
  const images = [pdcard, one, two, five, four, three];
  const navigate = useNavigate(); // ✅ Hook placed at the top level

  const handlePasswordChange = () => {
    navigate("/forgot-password");
  };

  const handleLogin = () => {
    console.log("Login attempt with:", { accessKey, username, password });
  };

  return (
    <Box sx={{ position: "relative", width: "100%", height: "100vh" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          width: "100%",
          height: "70vh",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            height: "100%",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          {isLargeScreen && (
            <Box
              sx={{
                flex: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: WHITE,
              }}
            >
              <Typography
                sx={{
                  fontSize: "24px",
                  fontWeight: 600,
                  textAlign: "center",
                  bgcolor: PRIMARY_BLUE,
                  padding: "50px",
                }}
              >
                Client Logo
              </Typography>
            </Box>
          )}
          <Box
            sx={{
              margin: "8px",
              flex: 1,
              backgroundColor: PRIMARY_BLUE,
              color: WHITE,
              padding: "40px",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography
              sx={{ fontSize: "24px", fontWeight: 600, color: MEDIUM_BLUE }}
            >
              Welcome back!
            </Typography>
            <Typography
              sx={{
                textAlign: "center",
                marginBottom: "32px",
                fontSize: "14px",
                color: MEDIUM_BLUE,
              }}
            >
              Nice to see you again.
              <br /> Login with your access key, username & password.
            </Typography>
            <Box sx={{ width: "100%", maxWidth: "320px" }}>
              <NuralLoginTextField
                type="password"
                placeholder="Enter Your Access Key"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
              />
              <Box sx={{ marginTop: "20px" }}>
                <NuralLoginTextField
                  type="text"
                  placeholder="Enter Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Box>
              <Box sx={{ marginTop: "10px" }}>
                <NuralLoginTextField
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Box>
              <Typography
                sx={{
                  textAlign: "center",
                  cursor: "pointer",
                  color: LIGHT_GRAY2,
                  marginTop: "10px",
                  fontSize: "8px",
                  paddingBottom: "10px",
                }}
                onClick={handlePasswordChange}
              >
                FORGOT PASSWORD?
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <NuralButton
                  text="LOGIN"
                  onClick={handleLogin}
                  sx={{
                    width: "50%",
                    borderRadius: "40px",
                    padding: "10px",
                    border: "1px solid white",
                    color: LIGHT_GRAY2,
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: AQUA,
                      color: GREEN_COLOR,
                      fontWeight: "bold",
                    },
                  }}
                />

                <NuralButton
                  text="LOGIN WITH OTP"
                  variant="outlined"
                  onClick={handleLogin}
                  sx={{
                    width: "50%",
                    borderRadius: "40px",
                    padding: "10px",
                    border: "1px solid white",
                    color: LIGHT_GRAY2,
                    fontWeight: "bold",
                    "&:hover": {
                      backgroundColor: AQUA,
                      color: GREEN_COLOR,
                      fontWeight: "bold",
                    },
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: "30vh",
          display: "flex",
          flexDirection: "column",
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
              style={{ width: "8%" }}
            />
          </Grid>
        </Grid>
      </Box>
      <Box
        sx={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          height: "30vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Image Slider Section (85% of 30vh) */}
        <Box
          sx={{
            width: "100%",
            height: "85%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              overflowX: "auto",
              width: "100%",
              height: "100%",
              whiteSpace: "nowrap",
              scrollbarWidth: "none",
              "&::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {images.map((img, index) => (
              <Box
                key={index}
                sx={{
                  flexShrink: 0,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "10px",
                  marginBottom: "10px",
                }}
              >
                <img
                  src={img}
                  alt={`Slide ${index}`}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    borderRadius: "10px",
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>

        {/* Footer (15% of 30vh) */}
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
                style={{ width: "8%" }} // Adjust image size as needed
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginForm;
