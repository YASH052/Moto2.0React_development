import { Grid, Typography } from "@mui/material";
import React, { useEffect } from "react";

import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import { AQUA, DARK_PURPLE, PRIMARY_BLUE2 } from "../../../Common/colors";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import NuralTextField from "../../NuralCustomComponents/NuralTextField";
import NuralRadioButton from "../../NuralCustomComponents/NuralRadioButton";
import StatusModel from "../../../Common/StatusModel";
import Required from "../../../Common/Required";
import { manageIssueCategory } from "../../../Api/Api";
import { FormSkeleton } from "../../../Common/Skeletons";

const radioOptions = [
  { value: "yes", label: "Interface" },
  { value: "no", label: "Batch" },
];

const labelStyle = {
  fontSize: "10px",
  lineHeight: "13.66px",
  letterSpacing: "4%",
  color: PRIMARY_BLUE2,
  marginBottom: "5px",
  fontWeight: 400,
};

const CreateCategory = ({ onRecordAdded, editData }) => {
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    issueCategoryCode: "",
    issueCategoryName: "",
    issueCategoryId: 1,
    status: 1,
    callType: 0,
  });
  const [errors, setErrors] = React.useState({
    issueCategoryCode: "",
    issueCategoryName: "",
  });

  const [accordionExpanded, setAccordionExpanded] = React.useState(true);
  const [showModel, setShowModel] = React.useState(false);
  const [status, setStatus] = React.useState(0);
  const [title, setTitle] = React.useState("");

  useEffect(() => {
    console.log("editData", editData);
    if (editData) {
      setFormData({
        issueCategoryCode: editData.code,
        issueCategoryName: editData.name,
        issueCategoryId: editData.id,
        status: editData.status ? 1 : 0,
        callType: 1,
      });
    }
  }, [editData]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      issueCategoryCode: "",
      issueCategoryName: "",
    };

    // Validate issueCategoryName
    if (!formData.issueCategoryName.trim()) {
      newErrors.issueCategoryName = "Issue Category Name is required";
      isValid = false;
    }

    // Validate issueCategoryCode
    if (!formData.issueCategoryCode.trim()) {
      newErrors.issueCategoryCode = "Issue Category Code is required";
      isValid = false;
    } else if (formData.issueCategoryCode.length > 50) {
      newErrors.issueCategoryCode = "Code cannot exceed 50 characters";
      isValid = false;
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.issueCategoryCode)) {
      newErrors.issueCategoryCode = "Code must be alphanumeric with no spaces";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (field, value) => {
    // Prevent spaces in issueCategoryCode
    if (field === "issueCategoryCode") {
      // Remove any spaces from the value
      value = value.replace(/\s/g, "");
    }

    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const handlePost = async () => {
    if (!validateForm()) {
      return;
    }
    setLoading(true);
    try {
      const res = await manageIssueCategory(formData);

      if (res.statusCode == 200) {
        setShowModel(true);
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
        if (onRecordAdded) {
          onRecordAdded();
        }
        setTimeout(() => {
          setShowModel(false);
        }, 3000);
        setFormData({
          issueCategoryCode: "",
          issueCategoryName: "",
          issueCategoryId: 1,
          status: 1,
          callType: 0,
        });
      } else {
        setShowModel(true);
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
      }
    } catch (error) {
      setShowModel(true);
      setStatus(error.status || 500);
      setTitle(error.statusMessage || "Internal Server Error");
      console.error("Error in handlePost:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      issueCategoryCode: "",
      issueCategoryName: "",
      issueCategoryId: 1,
      status: 1,
      callType: 0,
    });
    setErrors({});
    setShowModel(false);
  };

  return (
   
     
        <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
          <Grid container spacing={2} direction="column">
            {loading ? (
              <FormSkeleton />
            ) : (
              <Grid item>
                <Grid item xs={12} sm={12} md={12} lg={12} mt={0.5}>
                  <NuralAccordion2
                    title="Create Issue Category"
                    controlled={true}
                    expanded={accordionExpanded}
                    onChange={(event, expanded) =>
                      setAccordionExpanded(expanded)
                    }
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: "Manrope",
                        fontWeight: 700,
                        fontSize: "14px",
                        lineHeight: "100%",
                        letterSpacing: "0%",
                        color: DARK_PURPLE,
                        marginBottom: "10px",
                        marginTop: "10px",
                        // marginLeft: "10px",
                        marginRight: "10px",
                        mb: 3,
                      }}
                    >
                      Create
                    </Typography>
                    <Grid item xs={12} md={6} lg={6} mb={2}>
                      <Typography
                        variant="h6"
                        sx={{
                          ml: 0,
                          color: DARK_PURPLE,
                          fontFamily: "Manrope",
                          fontWeight: 400,
                          fontSize: "10px",
                          lineHeight: "13.66px",
                          letterSpacing: "4%",
                        }}
                      >
                        SELECT MODE
                      </Typography>
                      <NuralRadioButton
                        label="Store Type"
                        options={radioOptions}
                        value={radioOptions[0].value}
                        width="100%"
                        fontWeight={400}
                        fontSize="12px"
                        onChange={(value) => console.log(value)}
                      />
                    </Grid>
                    <Grid container spacing={4}>
                      <Grid item xs={12} sm={6} md={6} lg={6}>
                        <Typography
                          variant="body1"
                          sx={{
                            ...labelStyle,
                            fontSize: { xs: "12px", sm: "10px" },
                          }}
                          fontWeight={600}
                        >
                          ISSUE CATEGORY NAME <Required />
                        </Typography>
                        <NuralTextField
                          value={formData.issueCategoryName}
                          onChange={(e) => {
                            const value = e.target.value;
                            handleChange("issueCategoryName", value);
                          }}
                          width="100%"
                          placeholder="ENTER ISSUE CATEGORY NAME"
                          error={!!errors.issueCategoryName}
                          errorMessage={errors.issueCategoryName}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={6} lg={6}>
                        <Typography
                          variant="body1"
                          sx={{
                            ...labelStyle,
                            fontSize: { xs: "12px", sm: "10px" },
                          }}
                          fontWeight={600}
                        >
                          ISSUE CATEGORY CODE <Required />
                        </Typography>
                        <NuralTextField
                          value={formData.issueCategoryCode}
                          onChange={(e) => {
                            const value = e.target.value;
                            handleChange("issueCategoryCode", value);
                          }}
                          width="100%"
                          placeholder="ENTER ISSUE CATEGORY CODE"
                          error={!!errors.issueCategoryCode}
                          errorMessage={errors.issueCategoryCode}
                        />
                      </Grid>
                    </Grid>
                  </NuralAccordion2>
                  {showModel && (
                    <Grid item xs={12} sm={12} md={12} lg={12} pr={2} mt={0.5}>
                      <StatusModel width="100%" status={status} title={title} />
                    </Grid>
                  )}

                  {accordionExpanded && (
                    <Grid
                      container
                      spacing={1}
                      mt={0.5}
                      sx={{
                        flexDirection: { xs: "column", sm: "row" },
                        gap: { xs: 2, sm: 0 },
                      }}
                    >
                      <Grid item xs={12} sm={6} md={6}>
                        <NuralButton
                          text="CANCEL"
                          variant="outlined"
                          color={PRIMARY_BLUE2}
                          fontSize="12px"
                          height="36px"
                          borderColor={PRIMARY_BLUE2}
                          onClick={handleCancel}
                          width="100%"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6} md={6}>
                        <NuralButton
                          text="SAVE"
                          variant="contained"
                          color={PRIMARY_BLUE2}
                          fontSize="12px"
                          height="36px"
                          backgroundColor={AQUA}
                          onClick={handlePost}
                          width="100%"
                        />
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
    


   
  );
};

export default CreateCategory;
