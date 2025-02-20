import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { DARK_PURPLE } from "../../../Common/colors";
import NuralLoginTextField from "../../NuralCustomComponents/NuralLoginTextField";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import one from "../../../../assets/carousel/one.png";
import two from "../../../../assets/carousel/two.png";
import three from "../../../../assets/carousel/three.png";
import four from "../../../../assets/carousel/Four.png";
import five from "../../../../assets/carousel/five.png";
import pdcard from "../../../../assets/carousel/pdcard.png";

const images = [one, two, three, four, five, pdcard];

const settings = {
dots: true,
infinite: true,
speed: 500,
slidesToShow: 1,
slidesToScroll: 1,
autoplay: true,
autoplaySpeed: 2000,
arrows: false,
};;

const LoginForm = () => {
  const [accessKey, setAccessKey] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    console.log("Login attempt with:", { accessKey, username, password });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "70vh",
        backgroundColor: "#F4F7FC",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          height: "100%",
          backgroundColor: "#FFFFFF",
          borderRadius: "8px",
          overflow: "hidden",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)"
        }}
      >
        <Box
          sx={{
            flex: 1,
            width: "50%",
            height: "100%",
            backgroundColor: "#FFFFFF",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "10px"
          }}
        >
          <Typography
            sx={{
              fontSize: "24px",
              fontWeight: 600,
              textAlign: "center",
              color: "#283593",
            }}
          >
            <Typography
              sx={{
                fontSize: "24px",
                fontWeight: 600,
                textAlign: "center",
                color: "#283593",
                bgcolor: "red",
                padding: "50px",
              }}
            >
              Client Logo
            </Typography>
          </Typography>
        </Box>
        <Box
          sx={{
            flex: 1,
            width: "50%",
            height: "100%",
            backgroundColor: "#283593",
            color: "#FFFFFF",
            padding: "40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "10px",
          }}
        >
          <Typography
            sx={{ fontSize: "20px", fontWeight: 600, textAlign: "center", color: '#C6CEED' }}
          >
            Welcome back!
          </Typography>
          <Typography sx={{ textAlign: "center", marginBottom: "32px", color: '#C6CEED',fontSize: "12px" }}>
            Nice to see you again.<br/> Login with your access key, username &
            password.
          </Typography>
          <Box sx={{ width: "100%", maxWidth: "350px" }}>
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
                marginBottom: "16px",
                marginTop: "10px",
                fontSize: '12px'
              }}
            >
              Forgot Password?
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                width: "100%",
              }}
            >
              <NuralButton
                text="LOGIN"
                variant="contained"
                onClick={handleLogin}
                sx={{
                  width: "50%",
                  backgroundColor: "#00C8E0",
                  borderRadius: "20px",
                  padding: "10px",
                }}
              />

              <NuralButton
                text="LOGIN WITH OTP"
                variant="outlined"
                onClick={handleLogin}
                sx={{
                  width: "50%",
                  borderRadius: "20px",
                  padding: "10px",
                  border: "1px solid white",
                  color: "white",
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
      sx={{
        width: "100%",
        height: "30vh", // ✅ Parent ki height fix 30vh
        display: "flex",
        flexDirection: "column", // ✅ Column layout
      }}
    >
      {/* 🖼 Image Slider (85% of 30vh) */}
      <Box
        sx={{
          width: "100%",
          height: "85%", // ✅ 85% height of parent
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f0f0f0",
        }}
      >
        <Box sx={{ width: "90%", height: "100%" }}>
          <Slider {...settings}>
            {images.map((img, index) => (
              <Box
                key={index}
                sx={{
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
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
          </Slider>
        </Box>
      </Box>

      {/* 🔹 Powered by Nural (15% of 30vh) */}
      <Box
        sx={{
          width: "100%",
          height: "15%", // ✅ 15% height of parent
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#00C8E0",
        }}
      >
        <Typography sx={{ color: "#FFFFFF", fontWeight: 500 }}>
          Powered by <b>Nural</b>
        </Typography>
      </Box>
    </Box>
      
    </Box>
  );
};

export default LoginForm;
