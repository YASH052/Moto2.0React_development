// import { Box, Grid, TextField } from "@mui/material";
// import React from "react";
// import BreadcrumbsHeader from "../../Common/BreadcrumbsHeader";

// import NuralLoginTextField from "../NuralCustomComponents/NuralLoginTextField";
// import NuralButton from "../NuralCustomComponents/NuralButton";
// import {
//   AQUA,
//   DARK_PURPLE,
//   LIGHT_GRAY2,
//   PRIMARY_BLUE2,
// } from "../../Common/colors";
// export const ChangePassword = () => {
//   return (
//     <Box padding={".5rem"}>
//       <Box>
//         <BreadcrumbsHeader pageTitle={"Profile"} />
//       </Box>
//       <Box
//         bgcolor={LIGHT_GRAY2}
//         mt={".6rem"}
//         padding={"1rem"}
//         borderRadius={"12px"}
//       >
//         <Box pt={".5rem"} fontWeight={"700"} color={DARK_PURPLE}>
//           Change Password
//         </Box>
//         <Grid container spacing={2} pt={"1.5rem"}>
//           <Grid item xs={12} sm={6} md={4}>
//             <Box fontSize={"12px"} color={DARK_PURPLE}>
//               OLD PASSWORD
//             </Box>
//             <NuralLoginTextField placeholder="xxxxxxx" />
//           </Grid>
//           <Grid item xs={12} sm={6} md={4}>
//             <Box fontSize={"12px"} color={DARK_PURPLE}>
//               
//               NEW PASSWORD
//             </Box>
//             <NuralLoginTextField placeholder="xxxxxxx" />
//           </Grid>
//           <Grid item xs={12} sm={6} md={4}>
//             <Box fontSize={"12px"} color={DARK_PURPLE}>
//               CONFIRM PASSWORD
//             </Box>
//             <NuralLoginTextField placeholder="xxxxxxx" />
//           </Grid>
//         </Grid>
//       </Box>
//       <Grid container spacing={1} mt={"1rem"}>
//         <Grid item xs={12} md={6} lg={6}>
//           <NuralButton
//             text="CANCEL"
//             variant="outlined"
//             borderColor={PRIMARY_BLUE2}
//             onClick={() => console.log("Upload clicked")}
//             width="100%"
//           />
//         </Grid>
//         <Grid item xs={12} md={6} lg={6}>
//           <NuralButton
//             text="PROCEED"
//             backgroundColor={AQUA}
//             variant="contained"
//             onClick={() => console.log("Upload clicked")}
//             width="100%"
//           />
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };


import { Box, Grid, TextField } from "@mui/material";
import React, { useState } from "react";
import BreadcrumbsHeader from "../../Common/BreadcrumbsHeader";
import NuralLoginTextField from "../NuralCustomComponents/NuralLoginTextField";
import NuralButton from "../NuralCustomComponents/NuralButton";
import {
  AQUA,
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
} from "../../Common/colors";

export const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  // Regex pattern for password validation
  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

  const validatePassword = (password) => {
    if (!passwordRegex.test(password)) {
      return 'Password must be at least 8 characters long and include at least one number and one special character.';
    }
    return '';
  };

  const validateConfirmPassword = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      return 'Passwords do not match.';
    }
    return '';
  };

  const handleOldPasswordChange = (e) => {
    setOldPassword(e.target.value);
    setErrors((prevErrors) => ({
      ...prevErrors,
      oldPassword: '',
    }));
  };

  const handleNewPasswordChange = (e) => {
    const newPassword = e.target.value;
    setNewPassword(newPassword);
    setErrors((prevErrors) => ({
      ...prevErrors,
      newPassword: validatePassword(newPassword),
    }));
  };

  const handleConfirmPasswordChange = (e) => {
    const confirmPassword = e.target.value;
    setConfirmPassword(confirmPassword);
    setErrors((prevErrors) => ({
      ...prevErrors,
      confirmPassword: validateConfirmPassword(newPassword, confirmPassword),
    }));
  };

  const handleSubmit = () => {
    const newErrors = {
      newPassword: validatePassword(newPassword),
      confirmPassword: validateConfirmPassword(newPassword, confirmPassword),
    };

    if (Object.values(newErrors).every((error) => error === '')) {
      console.log('Form submitted');
      // Proceed with form submission logic
    } else {
      setErrors(newErrors);
    }
  };
  
  return (
    <Box padding={".5rem"}>
      <Box>
        <BreadcrumbsHeader pageTitle={"Profile"} />
      </Box>
      <Box
        bgcolor={LIGHT_GRAY2}
        mt={".6rem"}
        padding={"1rem"}
        borderRadius={"12px"}
      >
        <Box pt={".5rem"} fontWeight={"700"} color={DARK_PURPLE}>
          Change Password
        </Box>
        <Grid container spacing={2} pt={"1.5rem"}>
          <Grid item xs={12} sm={6} md={4}>
            <Box fontSize={"12px"} color={DARK_PURPLE}>
              OLD PASSWORD
            </Box>
            <NuralLoginTextField
              placeholder="xxxxxxx"
              value={oldPassword}
              onChange={handleOldPasswordChange}
              error={!!errors.oldPassword}
              helperText={errors.oldPassword}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box fontSize={"12px"} color={DARK_PURPLE}>   
             NEW PASSWORD
            </Box>
            <NuralLoginTextField
              placeholder="xxxxxxx"
              value={newPassword}
              onChange={handleNewPasswordChange}
              error={!!errors.newPassword}
              helperText={errors.newPassword}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Box fontSize={"12px"} color={DARK_PURPLE}>
              CONFIRM PASSWORD
            </Box>
            <NuralLoginTextField
              placeholder="xxxxxxx"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
          </Grid>
        </Grid>
      </Box>
      <Grid container spacing={1} mt={"1rem"}>
        <Grid item xs={12} md={6} lg={6}>
          <NuralButton
            text="CANCEL" 
            variant="outlined"
            borderColor={PRIMARY_BLUE2}
            onClick={() => console.log("Cancel clicked")}
            width="100%"
          />
        </Grid>
        <Grid  item xs={12} md={6} lg={6}> 
          <NuralButton
            text="PROCEED"
            backgroundColor={AQUA}
            variant="contained"
            onClick={handleSubmit}
            width="100%"
          />
        </Grid>
      </Grid>
    </Box>
  );
};