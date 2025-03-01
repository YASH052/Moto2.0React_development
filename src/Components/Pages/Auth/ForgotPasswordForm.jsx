import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  useMediaQuery,
  MenuItem,
  Select,
} from "@mui/material";
import {
  AQUA,
  DARK_PURPLE,
  GREEN_COLOR,
  LIGHT_GRAY2,
  MEDIUM_BLUE,
  PRIMARY_BLUE,
  PRIMARY_LIGHT_PURPLE,
  PRIMARY_LIGHT_PURPLE2,
  SECONDARY_BLUE,
  WHITE,
} from "../../Common/colors";
import NuralLoginTextField from "../NuralCustomComponents/NuralLoginTextField";
import NuralButton from "../NuralCustomComponents/NuralButton";
import one from "../../../assets/carousel/one.png";
import two from "../../../assets/carousel/two.png";
import three from "../../../assets/carousel/three.png";
import four from "../../../assets/carousel/Four.png";
import five from "../../../assets/carousel/five.png";
import pdcard from "../../../assets/carousel/pdcard.png";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import { useNavigate } from "react-router-dom";
import { isValidEmail, isValidPhone } from "../../Common/validations";
import axios from "axios";
const BASE_URL = "https://qa.nuralsales.com/MotoNewAPI/api/user";
import Loader from "../../Common/Loader";
import toast, { Toaster } from "react-hot-toast";

const ForgotPasswordForm = () => {
  // const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [selectedCountry, setSelectedCountry] = useState("IND +91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [sendOtp, setSendOtp] = useState(false);
  const [otpSubmitted, setOtpSubmitted] = useState(false);
  const [isOtpLogin, setIsOtpLogin] = useState(false);
  const isLargeScreen = useMediaQuery("(min-width:512px)");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const images = [pdcard, one, two, five, four, three];
  const navigate = useNavigate();
  const [errors, setErrors] = useState({
    phone: "",
    email: "",
    otp: "",
  });

  const ResetHooks = () => {
    navigate("/reset-password");
  };

  const validatePhone = (number) => {
    if (!number) return "";
    if (!isValidPhone(number)) {
      return "Please enter a valid 10-digit phone number";
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

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    if (value.length <= 10) {
      // Max length validation
      setPhoneNumber(value);
      setErrors((prev) => ({
        ...prev,
        phone: validatePhone(value),
      }));
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    if (value.length <= 50) {
      // Max length validation
      setEmail(value);
      setErrors((prev) => ({
        ...prev,
        email: validateEmail(value),
      }));
    }
  };

  const handleSendOtp = async () => {
    // setSendOtp(true);
    // Reset errors
    setErrors({
      phone: "",
      email: "",
      otp: "",
    });

    // Validate fields
    const phoneError = phoneNumber ? validatePhone(phoneNumber) : "";
    const emailError = email ? validateEmail(email) : "";

    // Check if at least one field is filled
    if (!phoneNumber && !email) {
      setErrors({
        phone: "Please enter either phone number or email",
        email: "Please enter either phone number or email",
        otp: "",
      });
      return;
    }

    // If there are validation errors, show them
    if (phoneError || emailError) {
      setErrors({
        phone: phoneError,
        email: emailError,
        otp: "",
      });
      return;
    }
    setLoading(true);
    try {
      let res = await axios.post(`${BASE_URL}/ForgotPasswordAPI`, {
        phone: phoneNumber,
        emailID: email,
      });
      if (res.status === 200) {
        toast.success(res.data.message);
        setTimeout(() => {
          setSendOtp(true);
        }, 3000);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error( error.message || error.response.data.message );
    } finally {
      setLoading(false);
    }

    // Proceed with sending OTP
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ""); // Only allow digits
    if (value.length <= 6) {
      // Assuming 6-digit OTP
      setUsername(value);
      setErrors((prev) => ({
        ...prev,
        otp: value.length === 6 ? "" : "Please enter a valid 6-digit OTP",
      }));
    }
  };

  const handleVerifyOtp = () => {
    if (!username || username.length !== 6) {
      setErrors((prev) => ({
        ...prev,
        otp: "Please enter a valid 6-digit OTP",
      }));
      return;
    }

    // Proceed with OTP verification
    ResetHooks();
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
                Reset it with your phone number.
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
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Select
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      sx={{
                        width: "120px",
                        backgroundColor: "transparent",
                        color: "white",
                        border: "1px solid white",
                        borderRadius: "4px",
                        "& .MuiSelect-select": {
                          padding: "8px 12px",
                        },
                      }}
                    >
                      <MenuItem
                        value="IND +91"
                        sx={{
                          fontFamily: "Manrope",
                          fontWeight: 700,
                          fontSize: "12px",
                          lineHeight: "16.39px",
                          letterSpacing: "4%",
                          textAlign: "center",
                        }}
                      >
                        IND +91
                      </MenuItem>
                      <MenuItem
                        value="IND +91"
                        sx={{
                          fontFamily: "Manrope",
                          fontWeight: 700,
                          fontSize: "12px",
                          lineHeight: "16.39px",
                          letterSpacing: "4%",
                          textAlign: "center",
                        }}
                      >
                        IND +91
                      </MenuItem>{" "}
                      <MenuItem
                        value="IND +91"
                        sx={{
                          fontFamily: "Manrope",
                          fontWeight: 700,
                          fontSize: "12px",
                          lineHeight: "16.39px",
                          letterSpacing: "4%",
                          textAlign: "center",
                        }}
                      >
                        IND +91
                      </MenuItem>{" "}
                      <MenuItem
                        value="IND +91"
                        sx={{
                          fontFamily: "Manrope",
                          fontWeight: 700,
                          fontSize: "12px",
                          lineHeight: "16.39px",
                          letterSpacing: "4%",
                          textAlign: "center",
                        }}
                      >
                        IND +91
                      </MenuItem>
                    </Select>
                    <NuralLoginTextField
                      type="text"
                      placeholder="ENTER PHONE NO."
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      fullWidth
                      error={!!errors.phone}
                      sx={{ backgroundColor: WHITE }}
                    />
                  </Box>
                  {errors.phone && (
                    <Typography
                      sx={{
                        color: "error.main",
                        fontSize: "12px",
                        marginTop: "4px",
                      }}
                    >
                      {errors.phone}
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
                    text="SEND OTP"
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
                Verify your phone number with OTP
              </Typography>
              <Box sx={{ width: "100%", maxWidth: "320px" }}>
                <NuralLoginTextField
                  type="phone"
                  placeholder="ENTER MOBILE NO."
                  value={phoneNumber}
                  readOnly={true}
                 
                  // onChange={(e) => setAccessKey(e.target.value)}
                />

                <Box sx={{ marginTop: "20px" }}>
                  <NuralLoginTextField
                    type="password"
                    placeholder="Enter OTP"
                    value={username}
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
      {loading && <Loader />}
      <Toaster />
    </Box>
  );
};

export default ForgotPasswordForm;
