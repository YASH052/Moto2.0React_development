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
  DARK_PURPLE,
  GREEN_COLOR,
  LIGHT_GRAY2,
  MEDIUM_BLUE,
  PRIMARY_BLUE,
  PRIMARY_LIGHT_PURPLE2,
  WHITE,
  RED,
  ERROR_RED2,
  ERROR_RED,
} from "../../Common/colors";
import NuralLoginTextField from "../NuralCustomComponents/NuralLoginTextField";
import NuralButton from "../NuralCustomComponents/NuralButton";
import one from "../../../assets/carousel/one.png";
import two from "../../../assets/carousel/two.png";
import three from "../../../assets/carousel/three.png";
import four from "../../../assets/carousel/Four.png";
import five from "../../../assets/carousel/five.png";
import pdcard from "../../../assets/carousel/pdcard.png";
import { CheckCircleOutlined as CheckCircleOutlinedIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { baseUrl } from "../../Common/urls";
import Slider from "../../Common/Slider";
import LoginFooter from "../../Common/LoginFooter";
const BASE_URL = "https://qa.nuralsales.com/MotoNewAPI/api/user";
const ResetPasswordForm = () => {
  let log;
  try {
    log = JSON.parse(localStorage.getItem("log"));
  } catch (error) {
    console.error("Error parsing log from localStorage:", error);
  }
  let email = localStorage.getItem("resetPasswordEmail");
  const images = [pdcard, one, two, five, four, three];

  const [newPassword, setNewPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });

  const [loginStatus, setLoginStatus] = useState(null);
  const isLargeScreen = useMediaQuery("(min-width:512px)");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (pass) => {
    if (!pass) {
      return "Password is required";
    }
    if (pass.includes(" ")) {
      return "Password cannot contain spaces";
    }
    if (pass.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (pass.length > 16) {
      return "Password must not exceed 16 characters";
    }

    // New validation rules
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasLowerCase = /[a-z]/.test(pass);
    const hasSpecialChar = /[!@#$%^&*+]/.test(pass);
    const hasNumber = /\d/.test(pass);

    if (!hasUpperCase) {
      return "Password must contain at least one uppercase letter";
    }
    if (!hasLowerCase) {
      return "Password must contain at least one lowercase letter";
    }
    if (!hasNumber) {
      return "Password must contain at least one number";
    }
    if (!hasSpecialChar) {
      return "Password must contain at least one special character";
    }

    return "";
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value.trim();
    if (!value.includes(" ")) {
      setPassword(value);
      setErrors((prev) => ({
        ...prev,
        password: validatePassword(value),
        confirmPassword:
          value !== confirmPassword ? "Passwords do not match" : "",
      }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value.trim();
    if (!value.includes(" ")) {
      setConfirmPassword(value);
      setErrors((prev) => ({
        ...prev,
        confirmPassword: value !== password ? "Passwords do not match" : "",
      }));
    }
  };

  const handleResetPassword = async () => {
    const passwordError = validatePassword(password);
    const confirmError = !confirmPassword
      ? "Please confirm password"
      : password !== confirmPassword
      ? "Passwords do not match"
      : "";

    setErrors({
      password: passwordError,
      confirmPassword: confirmError,
    });

    if (passwordError || confirmError) {
      return;
    }

    let body = {
      clientKey: "motoISP",
      userLoginName: localStorage.getItem("userName") || "",
      emailID: localStorage.getItem("email") || "",
      newPassword: password,
    };

    console.log(body);
    setLoading(true);

    try {
      let response = await axios.post(`${baseUrl}/ResetPassword/`, body);

      if (response.data.statusCode == 200) {
        setNewPassword(true);
        setLoginStatus("success");
        toast.success(
          response.data.statusMessage || "Password changed successfully"
        );
      } else {
        setLoginStatus("error");
        toast.error(response.data.statusMessage || "Password change failed");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setLoginStatus("error");
      toast.error(
        error.response.data ||
          "Error in sending mail. Please contact to administrator."
      );
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  };

  const ResetHooks = () => {
    navigate("/login");
  };

  const handleCancel = () => {
    navigate("/");
  };

  const preventSpaces = (e) => {
    if (e.key === " ") {
      e.preventDefault();
    }
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
      <Toaster />
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

          {!newPassword && (
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
              <Typography sx={{ fontSize: "24px", color: MEDIUM_BLUE }}>
                Reset Password
              </Typography>
              <Typography
                sx={{
                  textAlign: "center",
                  marginBottom: "15px",
                  fontSize: "14px",
                  color: PRIMARY_LIGHT_PURPLE2,
                }}
              >
                Set your new password and
                <br />
                re-enter the new password to confirm.
              </Typography>
              <Box sx={{ width: "100%", maxWidth: "320px" }}>
                <Box sx={{ position: "relative", marginBottom: "20px" }}>
                  <NuralLoginTextField
                    type="password"
                    placeholder="Enter New Password"
                    value={password}
                    onChange={handlePasswordChange}
                    onKeyDown={preventSpaces}
                    error={Boolean(errors.password)}
                    helperText={errors.password}
                  />
                  {errors.password && (
                    <Typography
                      sx={{
                        color: RED,
                        fontSize: "12px",
                        position: "absolute",
                        bottom: "-20px",
                        left: "0",
                        width: "100%",
                      }}
                    >
                      {errors.password}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ position: "relative", marginBottom: "20px" }}>
                  <NuralLoginTextField
                    type="password"
                    placeholder="Re Enter New Password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    onKeyDown={preventSpaces}
                    error={Boolean(errors.confirmPassword)}
                    helperText={errors.confirmPassword}
                  />
                  {errors.confirmPassword && (
                    <Typography
                      sx={{
                        color: RED,
                        fontSize: "12px",
                        position: "absolute",
                        bottom: "-20px",
                        left: "0",
                        width: "100%",
                      }}
                    >
                      {errors.confirmPassword}
                    </Typography>
                  )}
                </Box>

                <Typography
                  sx={{
                    fontSize: "10px",
                    color: LIGHT_GRAY2,
                    maxWidth: "69%",
                    margin: "auto",
                    fontWeight: "bold",
                    textAlign: "center",
                    marginTop: "10px",
                  }}
                >
                  Password requirements:
                  <br />
                  • 8-16 characters
                  <br />
                  • At least one uppercase letter
                  <br />
                  • At least one lowercase letter
                  <br />
                  • At least one number
                  <br />• At least one special character (!@#$%^&*+)
                </Typography>

                <Box
                  sx={{
                    mt: { xs: 2, sm: 0, lg: 1, xl: 2 },
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Grid
                    container
                    // sx={{
                    //   display: "flex",
                    //   flexDirection: { xs: "row", sm: "column" }, // Row for <512px, Column for larger
                    //   gap: "10px", // Space between buttons
                    //   alignItems: "center",
                    //   justifyContent: "center",
                    //   width: "100%",
                    // }}
                  >
                    <Grid item xs={12} sm={5.5}>
                      <NuralButton
                        text={
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 1,
                            }}
                          >
                            {loading ? (
                              <CircularProgress size={20} color="inherit" />
                            ) : loginStatus === "success" ? (
                              <CheckIcon />
                            ) : loginStatus === "error" ? (
                              <CloseIcon sx={{ color: ERROR_RED2 }} />
                            ) : (
                              "RESET PASSWORD"
                            )}
                            {/* LOGIN */}
                          </Box>
                        }
                        backgroundColor={
                          loginStatus === "error" ? ERROR_RED : AQUA
                        }
                        color={loginStatus === "error" ? WHITE : GREEN_COLOR}
                        onClick={handleResetPassword}
                        width="100%"
                        border="none"
                        fontSize="12px"
                        disabled={loading}
                      />
                    </Grid>
                    &nbsp; &nbsp; &nbsp;
                    <Grid item xs={12} sm={5.5}>
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
                          hoverColor={AQUA}
                          text="CANCEL"
                          variant="outlined"
                          onClick={handleCancel}
                          color={"white"}
                          width="100%"
                          fontSize="14px"
                          borderColor="white"
                          fontWeight="400"
                        />
                      </Box>
                    </Grid>
                  </Grid>
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
                color: WHITE,
                padding: "40px",
                borderRadius: "8px 8px 8px 8px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontSize: "20px", color: MEDIUM_BLUE }}>
                Reset Password
              </Typography>
              <Typography
                sx={{
                  textAlign: "center",
                  marginBottom: "32px",
                  fontSize: "12px",
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
                    fontWeight: "bold", // Bold text (optional)
                  }}
                >
                  Your password
                  <br />
                  was reset successfully.
                </Typography>
              </Typography>
              <Box sx={{ width: "100%", maxWidth: "320px" }}>
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
          )}
        </Box>
      </Box>
      {/* </Box> */}

      {/* Fixed Bottom Section (30% Height) */}
      <LoginFooter />
    </Box>
  );
};

export default ResetPasswordForm;
