import React, { useState } from "react";
import {
  Box,
  CircularProgress,
  Grid,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  AQUA,
  GREEN_COLOR,
  LIGHT_GRAY2,
  MEDIUM_BLUE,
  PRIMARY_BLUE,
  PRIMARY_LIGHT_PURPLE2,
  WHITE,
} from "../../Common/colors";
import NuralLoginTextField from "../NuralCustomComponents/NuralLoginTextField";
import NuralButton from "../NuralCustomComponents/NuralButton";

import { useNavigate } from "react-router-dom";
import { isValidEmail } from "../../Common/validations";
import axios from "axios";
import Loader from "../../Common/Loader";
import toast, { Toaster } from "react-hot-toast";
import { baseUrl } from "../../Common/urls";
import Slider from "../../Common/Slider";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

const ForgotPasswordForm = () => {
  // const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const log = JSON.parse(localStorage.getItem("log"));
  console.log("log", log);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [sendOtp, setSendOtp] = useState(false);
  const [otpSubmitted, setOtpSubmitted] = useState(false);
  const [isOtpLogin, setIsOtpLogin] = useState(false);
  const isLargeScreen = useMediaQuery("(min-width:512px)");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [loginStatus, setLoginStatus] = useState(null); // 'success', 'error', or null
  const navigate = useNavigate();
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    otp: "",
  });
  const [displayField, setDisplayField] = useState("");
  const [otpResponse, setOtpResponse] = useState("");

  const ResetHooks = () => {
    navigate("/reset-password");
  };

  const validateUsername = (username) => {
    if (!username) return "Please enter your username";
    if (username.length < 3) {
      return "Username must be at least 3 characters long";
    }
    return "";
  };

  const validateEmail = (email) => {
    if (!email) return "";
    if (!isValidEmail(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const handleUserChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    setErrors((prev) => ({
      ...prev,
      username: validateUsername(value),
    }));
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    if (value.length <= 50) {
      setEmail(value);
      setErrors((prev) => ({
        ...prev,
        email: validateEmail(value),
      }));
    }
  };

  const handleSendOtp = async () => {
    // Reset errors
    setErrors({
      username: "",
      email: "",
      otp: "",
    });
    setLoginStatus(null);
    // Validate fields
    const usernameError = username ? validateUsername(username) : "";
    const emailError = email ? validateEmail(email) : "";

    // Check if at least one field is filled
    if (!username && !email) {
      setErrors({
        username: "Please enter either username or email",
        email: "Please enter either username or email",
        otp: "",
      });
      return;
    }

    // If there are validation errors, show them
    if (usernameError || emailError) {
      setErrors({
        username: usernameError,
        email: emailError,
        otp: "",
      });
      return;
    }

    // Set which field to display in OTP screen
    if (email) {
      setDisplayField(email);
    } else {
      setDisplayField(username);
    }

    setLoading(true);
    try {
      let res = await axios.post(`${baseUrl}/ForgotPasswordOTP`, {
        clientKey: "motoISP",
        userLoginName: username,
        emailID: email,
      });
      if (res.status === 200) {
        toast.success(res.data.statusMessage);
        setOtpResponse(res.data.otp);
        setSendOtp(true);
        setLoginStatus("success");
      } else {
        toast.error(res.data.message);
        setLoginStatus("error");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data || error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    if (value.length <= 6) {
      setOtp(value);
      setErrors((prev) => ({
        ...prev,
        otp: value.length === 6 ? "" : "Please enter a valid 6-digit OTP",
      }));
    }
  };

  const handleVerifyOtp = () => {
    if (!otp || otp.length !== 6) {
      setErrors((prev) => ({
        ...prev,
        otp: "Please enter a valid 6-digit OTP",
      }));
      return;
    }

    // Verify OTP
    if (otp === otpResponse) {
      // Store email in localStorage for reset password page
      if (email) {
        localStorage.setItem("resetPasswordEmail", email);
      }
      // Proceed with OTP verification
      ResetHooks();
    } else {
      setErrors((prev) => ({
        ...prev,
        otp: "Incorrect OTP. Please try again.",
      }));
    }
  };

  const handleCancel = () => {
    navigate("/login");
  };

  const handleOtpLoginClick = () => {
    setIsOtpLogin(true);
    // Reset any existing errors
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
              <img
                src="/Images/innerlogo.gif"
                alt="logo"
                style={{ width: "50%" }}
              />
            </Box>
          )}

          {!sendOtp && (
            <Box
              sx={{
                margin: "8px",
                flex: 1,
                backgroundColor: PRIMARY_BLUE,
                padding: "40px",
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{ fontSize: "24px", color: MEDIUM_BLUE, marginBottom: 2 }}
              >
                Oops!
              </Typography>
              <Typography
                sx={{
                  textAlign: "center",
                  marginBottom: "32px",
                  fontSize: "14px",
                  color: PRIMARY_LIGHT_PURPLE2,
                }}
              >
                Forgotten your password? Don't worry.
                <br />
                Reset it with your username.
              </Typography>

              <Box sx={{ width: "100%", maxWidth: "320px" }}>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    marginBottom: 2,
                    flexDirection: "column",
                  }}
                >
                  <Box sx={{ width: "100%" }}>
                    <NuralLoginTextField
                      type="text"
                      width="100%"
                      placeholder="ENTER USERNAME"
                      value={username}
                      onChange={handleUserChange}
                      fullWidth
                      error={!!errors.username}
                      sx={{ backgroundColor: WHITE }}
                    />
                  </Box>
                  {errors.username && (
                    <Typography
                      sx={{
                        color: "error.main",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      {errors.username}
                    </Typography>
                  )}
                </Box>

                <Typography
                  sx={{
                    textAlign: "center",
                    marginY: 2,
                    color: PRIMARY_LIGHT_PURPLE2,
                    fontSize: "14px",
                  }}
                >
                  Or with your email
                </Typography>

                <Box sx={{ width: "100%" }}>
                  <NuralLoginTextField
                    type="email"
                    placeholder="ENTER EMAIL"
                    value={email}
                    onChange={handleEmailChange}
                    fullWidth
                    error={!!errors.email}
                    sx={{
                      backgroundColor: WHITE,
                      marginBottom: errors.email ? 1 : 3,
                    }}
                  />
                  {errors.email && (
                    <Typography
                      sx={{
                        color: "error.main",
                        fontSize: "12px",
                        marginBottom: 2,
                      }}
                    >
                      {errors.email}
                    </Typography>
                  )}
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    alignItems: "center",
                  }}
                >
                  <NuralButton
                    text={
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        {loading ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : loginStatus === "success" ? (
                          <CheckIcon />
                        ) : loginStatus === "error" ? (
                          <CloseIcon sx={{ color: ERROR_RED2 }} />
                        ) : (
                          "SEND OTP"
                        )}
                        {/* LOGIN */}
                      </Box>
                    }
                    backgroundColor={AQUA}
                    color={GREEN_COLOR}
                    onClick={handleSendOtp}
                    width="50%"
                    border="none"
                    fontSize="14px"
                  />

                  <NuralButton
                    text="CANCEL"
                    variant="outlined"
                    onClick={handleCancel}
                    color={"white"}
                    width="50%"
                    fontSize="14px"
                    borderColor="white"
                    fontWeight="400"
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
              <Typography sx={{ fontSize: "24px", color: MEDIUM_BLUE }}>
                Reset Password
              </Typography>
              <Typography
                sx={{
                  textAlign: "center",
                  marginBottom: "32px",
                  fontSize: "14px",
                  color: PRIMARY_LIGHT_PURPLE2,
                }}
              >
                Verify your username with OTP
              </Typography>
              <Box sx={{ width: "100%", maxWidth: "320px" }}>
                <NuralLoginTextField
                  type="text"
                  placeholder={email ? "ENTER EMAIL" : "ENTER USERNAME"}
                  value={displayField}
                  readOnly={true}
                />

                <Box sx={{ marginTop: "20px" }}>
                  <NuralLoginTextField
                    type="password"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={handleOtpChange}
                    error={!!errors.otp}
                  />
                  {errors.otp && (
                    <Typography
                      sx={{
                        color: "error.main",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      {errors.otp}
                    </Typography>
                  )}
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    marginTop: "20px",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <NuralButton
                    text="Submit Otp"
                    onClick={handleVerifyOtp}
                    sx={{
                      width: "50%",
                      borderRadius: "20px",
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
        <Slider />

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

      <Toaster />
    </Box>
  );
};

export default ForgotPasswordForm;
