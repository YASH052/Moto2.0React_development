import { Box, Typography } from "@mui/material";
import React from "react";
import Slider from "./Slider";
import { AQUA, AQUA_DARK } from "./colors";

const LoginFooter = () => {
    return (
        <Box
            sx={{
                // position: "absolute",
                // bottom: 0,
                // width: "100%",
                height: "30vh",
                display: "flex",
                flexDirection: "column",
                // backgroundColor: "red",
            }}
        >
            {/* Image Slider Section (85% of 30vh) */}
            <Box sx={{ height: "85%" }} >
                <Slider />
            </Box>
            {/* Footer (15% of 30vh) */}

            <Box sx={{ height: "15%", bgcolor: AQUA }}>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "10px",
                        // pt: "5px"
                        // height: "4px",
                    }}
                >
                    <Typography sx={{ fontSize: "12px", fontWeight: 400, color: AQUA_DARK }}>POWERED BY</Typography>
                    <img
                        src="/Images/nural-footer-logo.svg"
                        alt="logo"
                    // style={{ width: "100%" }} // Adjust image size as needed
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default LoginFooter;