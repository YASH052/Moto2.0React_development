import { Grid, Typography, FormHelperText } from "@mui/material";
import React, { useEffect, useState } from "react";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import { AQUA, DARK_PURPLE, PRIMARY_BLUE2 } from "../../../Common/colors";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import NuralTextField from "../../NuralCustomComponents/NuralTextField";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import NuralRadioButton from "../../NuralCustomComponents/NuralRadioButton";
import StatusModel from "../../../Common/StatusModel";
import { getIssueCategoryDropdown, manageIssueMaster } from "../../../Api/Api";
import Required from "../../../Common/Required";
import { FormSkeleton } from "../../../Common/Skeletons";

const radioOptions = [
  { value: "yes", label: "Interface" },
  { value: "no", label: "Batch" },
];

const CreateIssue = ({ onRecordAdded, editData }) => {
  const [showStatus, setShowStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(false);
  const [message, setMessage] = useState("");
  const [accordionExpanded, setAccordionExpanded] = useState(true);
  const [issueCategoryDrop, setIssueCategoryDrop] = useState([]);
  const [errors, setErrors] = useState({
    issueTypeID: "",
    issueCategoryId: "",
    issue: "",
  });

  const [formData, setFormData] = useState({
    issueMasterID: 0,
    issueTypeID: null,
    issueCategoryId: 0,
    issue: "",
    status: 1,
    callType: 0,
  });

  const labelStyle = {
    fontSize: "10px",
    lineHeight: "13.66px",
    letterSpacing: "4%",
    color: DARK_PURPLE,
    marginBottom: "5px",
    fontWeight: 400,
  };

  const options = [
    { label: "A", value: 1 },
    { label: "B", value: 2 },
    { label: "C", value: 3 },
    { label: "D", value: 4 },
  ];

  useEffect(() => {
    if (editData) {
      console.log("editData", editData);
      setFormData({
        issueMasterID: editData.id,
        issueTypeID: editData.issueTypeID || null,
        issueCategoryId: editData.issueCategoryID || 0,
        issue: editData.name,
        status: editData.status ? 1 : 0,
        callType: 1,
      });
    }
    fetchIssueCategoryDropdown();
  }, [editData]);

  const fetchIssueCategoryDropdown = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      const res = await getIssueCategoryDropdown();
      if (res.statusCode == 200) {
        if (res.issueCategoryList.length > 0) {
          setIssueCategoryDrop(res.issueCategoryList);
        } else {
          setIssueCategoryDrop([]);
        }
      } else {
        setIssueCategoryDrop([]);
      }

      // Temporary mock data
    } catch (error) {
      console.error("Error fetching issue categories:", error);
      setIssueCategoryDrop([]);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {
      issueTypeID: !formData.issueTypeID ? "Issue Type is required" : "",
      issueCategoryId: !formData.issueCategoryId
        ? "Issue Category is required"
        : "",
      issue: !formData.issue
        ? "Issue is required"
        : formData.issue.length > 50
        ? "Issue cannot exceed 50 characters"
        : "",
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handlePost = async () => {
    if (validateForm()) {
      setLoading(true);
      try {
        let res = await manageIssueMaster(formData);
        if (res.statusCode == 200) {
          setShowStatus(true);
          setStatus(res.statusCode);
          setMessage(res.statusMessage);
          if (onRecordAdded) {
            onRecordAdded();
          }
          handleCancel(); // Reset form after successful submission
          setTimeout(() => {
            setShowStatus(false);
          }, 3000);
        } else {
          setShowStatus(true);
          setStatus(res.statusCode);
          setMessage(res.statusMessage);
        }
      } catch (error) {
        setShowStatus(true);
        setStatus(error.status || "500");
        setMessage(error.message || "Internal Server Error");
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      issueMasterID: 0,
      issueTypeID: null,
      issueCategoryId: null,
      issue: "",
      status: 1,
      callType: 0,
      mode: "yes",
    });
    setErrors({
      issueTypeID: "",
      issueCategoryId: "",
      issue: "",
    });
  };

  return (
    <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
      {loading ? (
        <FormSkeleton />
      ) : (
        <Grid container spacing={2} direction="column">
          <Grid item>
            <Grid item xs={12} sm={12} md={12} lg={12} mt={0.5}>
              <NuralAccordion2
                title="Create Issue"
                controlled={true}
                expanded={accordionExpanded}
                onChange={(event, expanded) => setAccordionExpanded(expanded)}
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
                    value={formData.mode}
                    width="100%"
                    fontWeight={400}
                    fontSize="12px"
                    onChange={(value) => handleChange("mode", value)}
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
                      ISSUE TYPE <Required />
                    </Typography>
                    <NuralAutocomplete
                      label="Sale Type"
                      options={options}
                      placeholder="SELECT"
                      width="100%"
                      getOptionLabel={(option) => option.label || ""}
                      isOptionEqualToValue={(option, value) =>
                        option?.value === value?.value
                      }
                      onChange={(event, newValue) => {
                        handleChange("issueTypeID", newValue?.value || null);
                      }}
                      value={
                        options.find(
                          (option) => option.value === formData.issueTypeID
                        ) || null
                      }
                      error={!!errors.issueTypeID}
                    />
                    {errors.issueTypeID && (
                      <FormHelperText
                        sx={{
                          color: "error.main",
                          marginLeft: 0,
                          fontSize: "10px",
                        }}
                      >
                        {errors.issueTypeID}
                      </FormHelperText>
                    )}
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
                      ISSUE CATEGORY <Required />
                    </Typography>
                    <NuralAutocomplete
                      label="Issue Category"
                      options={issueCategoryDrop}
                      placeholder="SELECT"
                      width="100%"
                      getOptionLabel={(option) =>
                        option.issueCategoryName || ""
                      }
                      isOptionEqualToValue={(option, value) =>
                        option?.issueCategoryID === value?.issueCategoryID
                      }
                      onChange={(event, newValue) => {
                        handleChange(
                          "issueCategoryId",
                          newValue?.issueCategoryID || null
                        );
                      }}
                      value={
                        issueCategoryDrop.find(
                          (option) =>
                            option.issueCategoryID === formData.issueCategoryId
                        ) || null
                      }
                      error={!!errors.issueCategoryId}
                    />
                    {errors.issueCategoryId && (
                      <FormHelperText
                        sx={{
                          color: "error.main",
                          marginLeft: 0,
                          fontSize: "10px",
                        }}
                      >
                        {errors.issueCategoryId}
                      </FormHelperText>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} mt={-1}>
                    <Typography
                      variant="body1"
                      sx={{
                        ...labelStyle,
                        fontSize: { xs: "12px", sm: "10px" },
                      }}
                      fontWeight={600}
                    >
                      ISSUE <Required />
                    </Typography>
                    <NuralTextField
                      width="100%"
                      placeholder="ENTER ISSUE"
                      value={formData.issue}
                      onChange={(e) => handleChange("issue", e.target.value)}
                      error={!!errors.issue}
                      errorMessage={errors.issue}
                      inputProps={{
                        maxLength: 50,
                      }}
                    />
                  </Grid>
                </Grid>
              </NuralAccordion2>
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12} pr={2} mt={0.5}>
              {showStatus && (
                <StatusModel width="100%" status={status} title={message} />
              )}
            </Grid>

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
                    text={"SAVE"}
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
  );
};

export default CreateIssue;
