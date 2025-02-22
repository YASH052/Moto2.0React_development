import React, { useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import NuralLoginTextField from "../../NuralCustomComponents/NuralLoginTextField";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import one from "../../../../assets/carousel/one.png";
import two from "../../../../assets/carousel/two.png";
import three from "../../../../assets/carousel/three.png";
import four from "../../../../assets/carousel/Four.png";
import five from "../../../../assets/carousel/five.png";
import pdcard from "../../../../assets/carousel/pdcard.png";
import { AQUA, MEDIUM_BLUE, PRIMARY_BLUE, PRIMARY_BLUE2, WHITE } from "../../../Common/colors";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import { useMediaQuery } from "@mui/material";

const images = [pdcard, one, two, five, four, three];
const countries = [
  { code: "+91", name: "India", flag: "🇮🇳" },
  { code: "+1", name: "USA", flag: "🇺🇸" },
  { code: "+44", name: "UK", flag: "🇬🇧" },
  { code: "+61", name: "Australia", flag: "🇦🇺" },
  { code: "+81", name: "Japan", flag: "🇯🇵" },
];
const LoginForm = () => {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [sendOtp, setSendOtp] = useState(false);
  const [otpSubmitted, setOtpSubmitted] = useState(false);
  const [newPassword, setNewPassword] = useState(false);
  const isLargeScreen = useMediaQuery("(min-width:512px)");
  const [accessKey, setAccessKey] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const ResetHooks = () => {
    setShowForgotPassword(false);
    setSendOtp(false);
    setOtpSubmitted(false);
    setNewPassword(false);
  };

  const handleLogin = () => {
    console.log("Login attempt with:", { accessKey, username, password });
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100vh", // Full viewport height
        // backgroundColor: "#F4F7FC",
      }}
    >
      {/* Login Form Section (70% Height) */}
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
            // backgroundColor: "#FFFFFF",
            borderRadius: "8px",
            overflow: "hidden",
            // boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          {/* Left Panel - Logo */}
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
          {!showForgotPassword && (
            <Box
              sx={{
                margin: "8px",
                flex: 1,
                backgroundColor: PRIMARY_BLUE,
                color: WHITE,
                padding: "40px",
                borderRadius: "8px 8px 8px 8px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{ fontSize: "20px", fontWeight: 600, color: MEDIUM_BLUE }}
              >
                Welcome back!
              </Typography>
              <Typography
                sx={{
                  textAlign: "center",
                  marginBottom: "32px",
                  fontSize: "12px",
                  color: MEDIUM_BLUE,
                }}
              >
                Nice to see you again.
                <br /> Login with your access key, username & password.
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
                    marginTop: "10px",
                    fontSize: "12px",
                    paddingBottom: "10px",
                  }}
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot Password?
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
                    // variant="outlined"
                    onClick={handleLogin}
                    sx={{
                      width: "50%",
                      borderRadius: "20px",
                      padding: "10px",
                      border: "1px solid white",
                      color: WHITE,
                      "&:hover": {
                        backgroundColor: AQUA,
                      },
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
                      color: WHITE,
                      "&:hover": {
                        backgroundColor: AQUA,
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>
          )}

          {showForgotPassword && !sendOtp && (
            <Box
              sx={{
                margin: "8px",
                flex: 1,
                backgroundColor: PRIMARY_BLUE,
                color: WHITE,
                padding: "40px",
                borderRadius: "8px 8px 8px 8px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{ fontSize: "20px", fontWeight: 600, color: MEDIUM_BLUE }}
              >
                Oops!
              </Typography>
              <Typography
                sx={{
                  textAlign: "center",
                  marginBottom: "32px",
                  fontSize: "12px",
                  color: MEDIUM_BLUE,
                }}
              >
                Forgotten your password? Don’t worry.
                <br />
                Reset it with your phone number.
              </Typography>
              <Box sx={{ width: "100%", maxWidth: "350px" }}>
                <NuralLoginTextField
                  type="phone"
                  placeholder="Enter Phone Number"
                  // value={accessKey}
                  // onChange={(e) => setAccessKey(e.target.value)}
                />
                <Typography
                  sx={{
                    textAlign: "center",
                    cursor: "pointer",
                    marginBottom: "16px",
                    marginTop: "10px",
                    fontSize: "16px",
                  }}
                >
                  Or with your Email
                </Typography>
                <Box sx={{ marginTop: "20px" }}>
                  <NuralLoginTextField
                    type="text"
                    placeholder="Enter Email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Box>
                <Typography
                  sx={{
                    textAlign: "center",
                    cursor: "pointer",
                    marginBottom: "16px",
                    marginTop: "10px",
                    fontSize: "12px",
                  }}
                ></Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <NuralButton
                    text="Send OTP"
                    // variant="outlined"
                    onClick={() => setSendOtp(true)}
                    sx={{
                      width: "50%",
                      borderRadius: "20px",
                      padding: "10px",
                      border: "1px solid white",
                      color: "white",
                      "&:hover": {
                        backgroundColor: AQUA,
                      },
                    }}
                  />
                  <NuralButton
                    text="CANCEL"
                    // variant="outlined"
                    onClick={handleLogin}
                    sx={{
                      width: "50%",
                      borderRadius: "20px",
                      padding: "10px",
                      border: "1px solid white",
                      color: "white",
                      "&:hover": {
                        backgroundColor: AQUA,
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>
          )}
          {sendOtp && !otpSubmitted && (
            <Box
              sx={{
                margin: "8px",
                flex: 1,
                backgroundColor: PRIMARY_BLUE,
                color: "#FFFFFF",
                padding: "40px",
                borderRadius: "8px 8px 8px 8px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{ fontSize: "20px", fontWeight: 600, color: "#C6CEED" }}
              >
                Reset Password
              </Typography>
              <Typography
                sx={{
                  textAlign: "center",
                  marginBottom: "32px",
                  fontSize: "12px",
                  color: "#C6CEED",
                }}
              >
                Verify your phone number with OTP
              </Typography>
              <Box sx={{ width: "100%", maxWidth: "350px" }}>
                <NuralLoginTextField
                  type="phone"
                  placeholder=""
                  value={9783478340}
                  readOnly={true}
                  // onChange={(e) => setAccessKey(e.target.value)}
                />

                <Box sx={{ marginTop: "20px" }}>
                  <NuralLoginTextField
                    type="password"
                    placeholder="Enter Otp"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </Box>
                <Typography
                  sx={{
                    textAlign: "center",
                    cursor: "pointer",
                    marginBottom: "16px",
                    marginTop: "10px",
                    fontSize: "12px",
                  }}
                ></Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <NuralButton
                    text="Submit Otp"
                    // variant="outlined"
                    onClick={() => setOtpSubmitted(true)}
                    sx={{
                      width: "50%",
                      borderRadius: "20px",
                      padding: "10px",
                      border: "1px solid white",
                      color: "white",
                      "&:hover": {
                        backgroundColor: AQUA,
                      },
                    }}
                  />
                </Box>
              </Box>
            </Box>
          )}
          {otpSubmitted && !newPassword && (
            <Box
              sx={{
                margin: "8px",
                flex: 1,
                backgroundColor: PRIMARY_BLUE,
                color: "#FFFFFF",
                padding: "40px",
                borderRadius: "8px 8px 8px 8px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{ fontSize: "20px", fontWeight: 600, color: "#C6CEED" }}
              >
                Reset Password
              </Typography>
              <Typography
                sx={{
                  textAlign: "center",
                  marginBottom: "32px",
                  fontSize: "12px",
                  color: "#C6CEED",
                }}
              >
                Set your new password and
                <br />
                re-enter the new password to confirm.
              </Typography>
              <Box sx={{ width: "100%", maxWidth: "350px" }}>
                <NuralLoginTextField
                  type="password"
                  placeholder="Enter New Password"
                  value={accessKey}
                  onChange={(e) => setAccessKey(e.target.value)}
                />

                <Box sx={{ marginTop: "20px" }}>
                  <NuralLoginTextField
                    type="password"
                    placeholder="Re Enter New Password"
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                  />
                </Box>
                <Typography
                  sx={{
                    textAlign: "center",
                    cursor: "pointer",
                    marginBottom: "16px",
                    marginTop: "10px",
                    fontSize: "12px",
                  }}
                ></Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: "#C6CEED",
                      maxWidth: "69%",
                      textAlign: "center",
                    }}
                  >
                    Note: Your password should be comprised of at least 10
                    characters Use a combo of uppercase letters, lowercase
                    letters, numbers, & even some special characters (!, @, $,
                    %, ^, &, *, +, #)
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "row", sm: "column" }, // Row for <512px, Column for larger
                      gap: "10px", // Space between buttons
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <NuralButton
                      text="Reset Password"
                      // variant="outlined"
                      onClick={() => setNewPassword(true)}
                      sx={{
                        width: "50%",
                        borderRadius: "20px",
                        padding: "10px",
                        border: "1px solid white",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "aqua",
                        },
                      }}
                    />

                    <NuralButton
                      text="CANCEL"
                      // variant="outlined"
                      onClick={handleLogin}
                      sx={{
                        width: "50%",
                        borderRadius: "20px",
                        padding: "10px",
                        border: "1px solid white",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "aqua",
                        },
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          )}

          {newPassword && (
            <Box
              sx={{
                margin: "8px",
                flex: 1,
                backgroundColor: PRIMARY_BLUE,
                color: "#FFFFFF",
                padding: "40px",
                borderRadius: "8px 8px 8px 8px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{ fontSize: "20px", fontWeight: 600, color: "#C6CEED" }}
              >
                Reset Password
              </Typography>
              <Typography
                sx={{
                  textAlign: "center",
                  marginBottom: "32px",
                  fontSize: "12px",
                  color: "#C6CEED",
                }}
              >
                <CheckCircleOutlinedIcon
                  sx={{ fontSize: 40, color: AQUA, marginTop: "20px" }}
                />
                <Typography
                  sx={{
                    fontSize: "18px", // Adjust size
                    color: AQUA, // Change text color
                    textAlign: "center", // Center align (optional)
                  }}
                >
                  Your password
                  <br />
                  was reset successfully.
                </Typography>
              </Typography>
              <Box sx={{ width: "100%", maxWidth: "350px" }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "row", sm: "column" }, // Row for <512px, Column for larger
                      gap: "10px", // Space between buttons
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                    }}
                  >
                    <NuralButton
                      text="Login Again"
                      // variant="outlined"
                      onClick={ResetHooks}
                      sx={{
                        width: "50%",
                        borderRadius: "20px",
                        padding: "10px",
                        border: "1px solid white",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "aqua",
                        },
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      {/* </Box> */}

      {/* Fixed Bottom Section (30% Height) */}
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
