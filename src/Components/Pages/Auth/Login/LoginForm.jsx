import React, { useState } from "react";
import {
  Box,
  CircularProgress,
  Grid,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import NuralLoginTextField from "../../NuralCustomComponents/NuralLoginTextField";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import {
  AQUA,
  GREEN_COLOR,
  LIGHT_GRAY2,
  MEDIUM_BLUE,
  PRIMARY_BLUE,
  PRIMARY_LIGHT_PURPLE2,
  WHITE,
  ERROR_RED,
  ERROR_RED2,
} from "../../../Common/colors";
import pdcard from "../../../../assets/carousel/pdcard.png";
import one from "../../../../assets/carousel/one.png";
import two from "../../../../assets/carousel/two.png";
import three from "../../../../assets/carousel/three.png";
import four from "../../../../assets/carousel/Four.png";
import five from "../../../../assets/carousel/five.png";

import axios from "axios";
import Loader from "../../../Common/Loader";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import LoginIcon from "@mui/icons-material/Login";
const BASE_URL = "https://qa.nuralsales.com/MotoNewAPI/api/user";
const LoginForm = () => {
  // const [accessKey, setAccessKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [usernameErrorMsg, setUsernameErrorMsg] = useState("");
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
  const [isOtpLogin, setIsOtpLogin] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneErrorMsg, setPhoneErrorMsg] = useState("");
  const [emailErrorMsg, setEmailErrorMsg] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("91"); // Default to India
  const isLargeScreen = useMediaQuery("(min-width:512px)");
  const images = [pdcard, one, two, five, four, three];
  const navigate = useNavigate(); // ✅ Hook placed at the top level
  const [loginStatus, setLoginStatus] = useState(null); // 'success', 'error', or null
  const [invalidCredentials, setInvalidCredentials] = useState(false);
  const [otpStatus, setOtpStatus] = useState(null); // 'success', 'error', or null

  const countryCodes = [
    { code: "91", country: "IND" },
    { code: "1", country: "USA" },
    { code: "44", country: "UK" },
    { code: "61", country: "AUS" },
    // Add more country codes as needed
  ];

  const handleUsernameChange = (e) => {
    handleInputChange();
    const inputValue = e.target.value;

    // Check for spaces
    if (inputValue.includes(" ")) {
      setUsernameError(true);
      setUsernameErrorMsg("Spaces are not allowed");
      return;
    }

    // Check for length
    if (inputValue.length > 20) {
      setUsernameError(true);
      setUsernameErrorMsg("Maximum 20 characters allowed");
      return;
    }

    // If no validation errors, update the value
    const newValue = inputValue.replace(/\s/g, "");
    setUsername(newValue);

    // Clear error when valid input
    if (usernameError) {
      setUsernameError(false);
      setUsernameErrorMsg("");
    }
  };

  const handlePasswordChange = (e) => {
    handleInputChange();
    const inputValue = e.target.value;
    if (inputValue.includes(" ")) {
      setPasswordError(true);
      setPasswordErrorMsg("Spaces are not allowed");
      return;
    }
    // Check for length
    if (inputValue.length > 20) {
      setPasswordError(true);
      setPasswordErrorMsg("Maximum 20 characters allowed");
      return;
    }

    // If no validation errors, update the value
    setPassword(inputValue);

    // Clear error when valid input
    if (passwordError) {
      setPasswordError(false);
      setPasswordErrorMsg("");
    }
  };

  const handleLogin = async () => {
    // Reset states
    setUsernameError(false);
    setPasswordError(false);
    setUsernameErrorMsg("");
    setPasswordErrorMsg("");
    setInvalidCredentials(false);
    setLoginStatus(null);

    // Basic validation
    if (!username) {
      setUsernameError(true);
      setUsernameErrorMsg("Please enter username");
      return;
    }

    if (!password) {
      setPasswordError(true);
      setPasswordErrorMsg("Please enter password");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(`${BASE_URL}/login`, {
        ClientKey: "motoISP",
        UserName: username,
        Password: password,
        DeviceId: "",
        DeviceToken: "",
      });

      if (res.data.statusCode == 200) {
        setLoginStatus("success");

        localStorage.setItem(
          "log",
          JSON.stringify(res.data.loginReturnInfoList[0])
        );
        localStorage.setItem("userId", res.data.loginReturnInfoList[0].userId);
        localStorage.setItem(
          "authKey",
          res.data.loginReturnInfoList[0].authKey
        );
        setTimeout(() => {
          navigate("/");
        }, 800);
      } else {
        setLoginStatus("error");
        setInvalidCredentials(true);
        localStorage.removeItem("user");
        localStorage.removeItem("authKey");
        setUsernameError(true);
        setPasswordError(true);
      }
    } catch (error) {
      setLoginStatus("error");
      setInvalidCredentials(true);
      setUsernameError(true);
      setPasswordError(true);
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
    
  };

  const handleOtpLoginClick = () => {
    setIsOtpLogin(true);
    // Reset any existing errors
    setUsernameError(false);
    setPasswordError(false);
    setUsernameErrorMsg("");
    setPasswordErrorMsg("");
  };

  const handlePhoneChange = (e) => {
    setOtpStatus(null);
    const value = e.target.value;

    // Clear previous errors
    setPhoneError(false);
    setPhoneErrorMsg("");

    // Remove any non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, "");

    if (numericValue.length > 10) {
      setPhoneError(true);
      setPhoneErrorMsg("Phone number cannot exceed 10 digits");
      return;
    }

    if (value.includes(" ")) {
      setPhoneError(true);
      setPhoneErrorMsg("Spaces are not allowed");
      return;
    }

    setPhoneNumber(numericValue);
  };

  const handleEmailChange = (e) => {
    setOtpStatus(null);
    const value = e.target.value;

    // Clear previous errors
    setEmailError(false);
    setEmailErrorMsg("");

    if (value.includes(" ")) {
      setEmailError(true);
      setEmailErrorMsg("Spaces are not allowed");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      setEmailError(true);
      setEmailErrorMsg("Please enter a valid email address");
    }

    setEmail(value);
  };

  const handleSendOtp = async () => {
    // Reset errors
    setPhoneError(false);
    setEmailError(false);
    setPhoneErrorMsg("");
    setEmailErrorMsg("");
    setOtpStatus(null);

    // Check if both fields are empty
    if (!phoneNumber && !email) {
      setPhoneError(true);
      setEmailError(true);
      setPhoneErrorMsg("Please enter phone number or email");
      setEmailErrorMsg("Please enter phone number or email");
      return;
    }

    // Validation checks...
    if (phoneNumber && phoneNumber.length < 10) {
      setPhoneError(true);
      setPhoneErrorMsg("Please enter a valid 10-digit phone number");
      return;
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError(true);
        setEmailErrorMsg("Please enter a valid email address");
        return;
      }
    }

    setLoading(true);
    try {
      // TODO: Implement your OTP API call here
      // const response = await axios.post(`${BASE_URL}/send-otp`, {
      //   phoneNumber: phoneNumber ? `+${selectedCountry}${phoneNumber}` : null,
      //   email: email || null
      // });
      
      // Simulating API call success
      setOtpStatus('success');
      
      setTimeout(() => {
        // navigate to OTP verification page or show OTP input
      }, 1000);
    } catch (error) {
      setOtpStatus('error');
    } finally {
     
        setLoading(false);
      
    }
  };

  const handleInputChange = () => {
    setLoginStatus(null);
    setInvalidCredentials(false);
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
                color: PRIMARY_LIGHT_PURPLE2,
              }}
            >
              Nice to see you again.
              <br /> Login with your access key, username & password.
            </Typography>
            {!isOtpLogin ? (
              <Box sx={{ width: "100%", maxWidth: "320px" }}>
                <Box sx={{ marginTop: "20px" }}>
                  <NuralLoginTextField
                    type="text"
                    placeholder="Enter Username"
                    value={username}
                    onChange={handleUsernameChange}
                    error={usernameError}
                    errorMessage={usernameErrorMsg}
                    border={usernameError ? "1px solid #FF0000" : undefined}
                    maxLength={20}
                  />
                </Box>
                <Box sx={{ marginTop: "10px" }}>
                  <NuralLoginTextField
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onChange={handlePasswordChange}
                    error={passwordError}
                    errorMessage={passwordErrorMsg}
                    border={passwordError ? "1px solid #FF0000" : undefined}
                    maxLength={20}
                  />
                  {invalidCredentials && (
                    <Typography
                      sx={{
                        color: "error.main",
                        fontSize: "12px",
                        mt: 1,
                        textAlign: "center",
                      }}
                    >
                      Invalid credentials. Please try again.
                    </Typography>
                  )}
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
                  onClick={() => navigate("/forgot-password")}
                >
                  FORGOT PASSWORD?
                </Typography>

                <Box
                  sx={{
                    position: "relative",

                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    gap: "10px",
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
                          "LOGIN"
                        )}
                        {/* LOGIN */}
                      </Box>
                    }
                    backgroundColor={loginStatus === "error" ? ERROR_RED : AQUA}
                    color={loginStatus === "error" ? WHITE : GREEN_COLOR}
                    onClick={handleLogin}
                    width="50%"
                    border="none"
                    fontSize="12px"
                    disabled={loading}
                  />
                  <NuralButton
                    text="LOGIN WITH OTP"
                    variant="outlined"
                    onClick={handleOtpLoginClick}
                    color={"white"}
                    width="50%"
                    hoverColor="white"
                    fontSize="12px"
                    borderColor="white"
                  />
                </Box>
              </Box>
            ) : (
              <Box sx={{ width: "100%", maxWidth: "320px" }}>
                <Box sx={{ marginTop: "20px" }}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Box sx={{ width: "30%" }}>
                      <select
                        value={selectedCountry}
                        onChange={(e) => setSelectedCountry(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px",
                          borderRadius: "4px",
                          backgroundColor: "transparent",
                          color: "white",
                          border: "1px solid white",
                          outline: "none",
                          cursor: "pointer",
                          fontSize: "14px",
                        }}
                      >
                        {countryCodes.map((country) => (
                          <option
                            key={country.code}
                            value={country.code}
                            style={{ color: "black" }}
                          >
                            {country.country} +{country.code}
                          </option>
                        ))}
                      </select>
                    </Box>
                    <Box sx={{ width: "70%" }}>
                      <NuralLoginTextField
                        type="tel"
                        placeholder="ENTER PHONE NO."
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        error={phoneError}
                        errorMessage={phoneErrorMsg}
                        border={phoneError ? "1px solid #FF0000" : undefined}
                        maxLength={10}
                      />
                    </Box>
                  </Box>
                </Box>
                <Typography
                  sx={{
                    textAlign: "center",
                    color: MEDIUM_BLUE,
                    margin: "10px 0",
                    fontSize: "12px",
                  }}
                >
                  Or with your email
                </Typography>
                <Box sx={{ marginTop: "10px" }}>
                  <NuralLoginTextField
                    type="email"
                    placeholder="ENTER EMAIL"
                    value={email}
                    onChange={handleEmailChange}
                    error={emailError}
                    errorMessage={emailErrorMsg}
                    border={emailError ? "1px solid #FF0000" : undefined}
                  />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                    marginTop: "20px",
                  }}
                >
                  <NuralButton
                    text={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {loading ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : otpStatus === "success" ? (
                          <CheckIcon />
                        ) : otpStatus === "error" ? (
                          <CloseIcon sx={{ color: ERROR_RED2 }} />
                        ) : (
                          "SEND OTP"
                        )}
                      </Box>
                    }
                    backgroundColor={otpStatus === "error" ? ERROR_RED : AQUA}
                    color={otpStatus === "error" ? WHITE : GREEN_COLOR}
                    onClick={handleSendOtp}
                    width="50%"
                    border="none"
                    fontSize="12px"
                    disabled={loading}
                  />

                  <NuralButton
                    text="LOGIN ANOTHER WAY"
                    variant="outlined"
                    onClick={() => {
                      setIsOtpLogin(false);
                      setOtpStatus(null);
                    }}
                    color={"white"}
                    width="50%"
                    fontSize="12px"
                    borderColor="white"
                  />
                </Box>
              </Box>
            )}
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
