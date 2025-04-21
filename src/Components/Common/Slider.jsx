import React from "react";
import { Box } from "@mui/material";

import one from "../../assets/carousel/one.png";
import two from "../../assets/carousel/two.png";
import three from "../../assets/carousel/three.png";
import four from "../../assets/carousel/Four.png";
import five from "../../assets/carousel/five.png";
import pdcard from "../../assets/carousel/pdcard.png";

const Slider = () => {
  const images = [pdcard, one, two, five, four, three];

  return (
    <Box
      sx={{
        width: "100%",
        height: "85%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 2,
          width: "100%",
          height: "100%",
          animation: "scroll 50s linear infinite",
          "&:hover": {
            animationPlayState: "paused",
          },
          "@keyframes scroll": {
            "0%": {
              transform: "translateX(0)",
            },
            "100%": {
              transform: "translateX(calc(-300px * 6 - 16px))",
            },
          },
        }}
      >
        {[...images, ...images].map((img, index) => (
          <Box
            key={index}
            sx={{
              flexShrink: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "10px",
              marginBottom: "10px",
              width: "300px",
            }}
          >
            <img
              src={img}
              alt={`Slide ${index}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: "10px",
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Slider;
