import { Grid, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import {
  AQUA,
  DARK_PURPLE,
  LIGHT_BLUE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  MEDIUM_BLUE,
} from "../../../Common/colors";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import NuralTextField from "../../NuralCustomComponents/NuralTextField";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import { Search, FileDownload } from "@mui/icons-material";
import NuralTextButton from "../../NuralCustomComponents/NuralTextButton";
import { useNavigate } from "react-router-dom";
import { ManageISPAgencyMaster } from "../../../Api/Api";
const tabs = [
  { label: "Add Agency", value: "add-agancy" },
  { label: "Search", value: "search-agancy" },
];
import StatusModel from "../../../Common/StatusModel";
import { LoadingSkeleton, AddAgencySkeleton } from "../../../Common/SkeletonComponents";
import Required from "../../../Common/Required";
import { useDispatch, useSelector } from "react-redux";
import { setEditAgencyData } from "../../../Redux/action";

const AddAgancy = () => {
  const dispatch = useDispatch();
  const editAgencyData = useSelector((state) => state.editAgencyData);
  useEffect(() => {
    if (editAgencyData && Object.keys(editAgencyData).length > 0) {
      console.log("editAgencyData", editAgencyData);
      setFormData({
        AgencyId: editAgencyData.agencyId,
        AgencyCode: editAgencyData.agencyCode,
        AgencyName: editAgencyData.agencyName,
        ContactPersonName: editAgencyData.contactPerson,
        MobileNo: editAgencyData.mobileNo,
        Email: editAgencyData.emailID,
        UserName: editAgencyData.loginName,
        Password: editAgencyData.password,
        Status: editAgencyData.status,
        CallType: 1,
      });
    }
  }, [editAgencyData]);

  const [accordionExpanded, setAccordionExpanded] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState("add-agancy");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [tittle, setTittle] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    AgencyId: 0,
    AgencyCode: "",
    AgencyName: "",
    ContactPersonName: "",
    MobileNo: "",
    Email: "",
    UserName: "",
    Password: "", //Password should not be blank.  
    Status: 1, /*1=Active 0=InActive*/
    CallType: 0 /*0=Save ,1=Update ,2=Status*/
  });

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  const validateField = (name, value) => {
    switch (name) {
      case "AgencyName":
        return !value ? "Agency Name is required" : "";
      case "AgencyCode":
        return !value ? "Agency Code is required" : "";
      case "ContactPersonName":
        return !value ? "Contact Person is required" : "";
      case "MobileNo":
        return !value
          ? "Mobile Number is required"
          : !/^[0-9]{10}$/.test(value)
            ? "Invalid mobile number"
            : "";
      case "Email":
        return !value
          ? "Email is required"
          : !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)
            ? "Invalid Email address"
            : "";
      case "UserName":
        return !value ? "UserName is required" : "";
      case "Password":
        return !value
          ? "Password is required"
          : value.length < 6
            ? "Password must be at least 6 characters"
            : "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
    setFormData({ ...formData, [name]: value });
  };

  const handleCancel = () => {
    setFormData({
      AgencyName: "",
      AgencyCode: "",
      ContactPersonName: "",
      MobileNo: "",
      Email: "",
      UserName: "",
      Password: "",
      Status: 1,
      CallType: 0,
    });
    setErrors({});
    dispatch(setEditAgencyData({}));
    setStatus(null);
    setTittle(null);
  };

  const handlePost = async () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    setErrors(newErrors);

    // If there are errors, return early
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    try {
      setIsLoading(true);
      const response = await ManageISPAgencyMaster(formData);
      if (response.statusCode == 200) {
        setStatus(response.statusCode);
        setTittle(response.statusMessage || "Something went wrong");
        setFormData({
          AgencyName: "",
          AgencyCode: "",
          ContactPersonName: "",
          MobileNo: "",
          Email: "",
          UserName: "",
          Password: "",
          Status: 1,
          CallType: 0,
        });
      }
      else {
        setStatus(response.statusCode);
        setTittle(response.statusMessage || "Something went wrong");
      }

    } catch (error) {
      console.error("Error in AddAgency:", error);
      setStatus(response.statusCode);
      setTittle(response.statusMessage || "Something went wrong");
      throw error;
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        setErrors({});
        setStatus(null);
        setTittle(null);
      }, 3000);
    }
  };

  const updateAgencyMaster = async () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    setErrors(newErrors);

    // If there are errors, return early
    if (Object.keys(newErrors).length > 0) {
      return;
    }
    try {
      setIsLoading(true);
      const response = await ManageISPAgencyMaster(formData);
      setStatus(response.statusCode);
      setTittle(response.statusMessage || "Something went wrong");
      dispatch(setEditAgencyData({}));
      if (response.statusCode == 200) {
        setTimeout(() => {
          setErrors({});
          setStatus(null);
          setTittle(null);
          navigate("/search-agancy");
        }, 2000);
      }
    } catch (error) {
      console.error("Error in UpdateAgency:", error);
      setStatus(response.statusCode);
      setTittle(response.statusMessage || "Something went wrong");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };




  return (
    <>
      {isLoading ? (
        <AddAgencySkeleton />
      ) : (
        <Grid container spacing={0}>
          {" "}
          <Grid
            item
            xs={12}
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 1000,
              backgroundColor: "#fff",
              paddingBottom: 1,
            }}
          >
            <Grid item xs={12} mt={3} mb={0} ml={1}>
              <BreadcrumbsHeader pageTitle="Agency" />
            </Grid>

            <Grid item xs={12} ml={1}>
              <TabsBar
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={handleTabChange}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            {/* Agency Details */}
            <Grid item xs={12} md={6} lg={6} sx={{ pr: 2 }}>
              <Grid container spacing={2} direction="column">
                <Grid item>
                  <NuralAccordion2
                    title="Agency Details"
                    backgroundColor={LIGHT_GRAY2}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6} lg={6}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: PRIMARY_BLUE2,
                            fontFamily: "Manrope",
                            fontWeight: 400,
                            fontSize: "10px",
                            lineHeight: "13.66px",
                            letterSpacing: "4%",
                            mb: 1,
                            textTransform: "uppercase"
                          }}
                        >
                          Agency name <Required />
                        </Typography>
                        <NuralTextField
                          width="100%"
                          placeholder="AGENCY NAME"
                          backgroundColor={LIGHT_BLUE}
                          name="AgencyName"
                          value={formData.AgencyName}
                          onChange={handleChange}
                          error={!!errors.AgencyName}
                          errorMessage={errors.AgencyName}
                        />
                      </Grid>

                      <Grid item xs={12} md={6} lg={6}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: PRIMARY_BLUE2,
                            fontFamily: "Manrope",
                            fontWeight: 400,
                            fontSize: "10px",
                            lineHeight: "13.66px",
                            letterSpacing: "4%",
                            mb: 1,
                            textTransform: "uppercase"
                          }}
                        >
                          Agency code <Required />
                        </Typography>
                        <NuralTextField
                          width="100%"
                          placeholder="AGENCY CODE"
                          backgroundColor={LIGHT_BLUE}
                          name="AgencyCode"
                          value={formData.AgencyCode}
                          onChange={handleChange}
                          onKeyDown={(e) => {
                            if (e.key === " ") {
                              e.preventDefault();
                              setErrors((prev) => ({
                                ...prev,
                                AgencyCode: "Space is not allowed",
                              }));
                            }
                          }}
                          error={!!errors.AgencyCode}
                          errorMessage={errors.AgencyCode}
                        />
                      </Grid>
                    </Grid>
                  </NuralAccordion2>
                </Grid>
              </Grid>
              <Grid item xs={12} md={12} lg={12} pr={2} mt={1}>
                {status && (
                  <StatusModel width="100%"
                    status={status}
                    title={tittle}
                    onClose={() => setStatus(null)}
                  />
                )}
              </Grid>
            </Grid>



            {/* Contact Details */}
            <Grid item xs={12} md={6} lg={6} sx={{ pr: 2 }}>
              <Grid container spacing={2} direction="column">
                <Grid item>
                  <NuralAccordion2
                    title="Contact Details"
                    controlled={true}
                    expanded={accordionExpanded}
                    onChange={(event, expanded) => setAccordionExpanded(expanded)}
                    backgroundColor={LIGHT_GRAY2}
                  >
                    <Grid container spacing={2} mt={1}>
                      <Grid item xs={12}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: PRIMARY_BLUE2,
                            fontFamily: "Manrope",
                            fontWeight: 400,
                            fontSize: "10px",
                            lineHeight: "13.66px",
                            letterSpacing: "4%",
                            mb: 1,
                            textTransform: "uppercase"
                          }}
                        >
                          Contact Person <Required />
                        </Typography>
                        <NuralTextField
                          width="100%"
                          placeholder="CONTACT PERSON"
                          backgroundColor={LIGHT_BLUE}
                          name="ContactPersonName"
                          value={formData.ContactPersonName}
                          onChange={handleChange}
                          error={!!errors.ContactPersonName}
                          errorMessage={errors.ContactPersonName}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={2} sx={{ marginTop: 0 }}>
                      <Grid item xs={12} md={6} lg={6}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: PRIMARY_BLUE2,
                            fontFamily: "Manrope",
                            fontWeight: 400,
                            fontSize: "10px",
                            lineHeight: "13.66px",
                            letterSpacing: "4%",
                            mb: 1,
                            textTransform: "uppercase"
                          }}
                        >
                          Mobile No. <Required />
                        </Typography>
                        <NuralTextField
                          width="100%"
                          placeholder="MOBILE NO."
                          backgroundColor={LIGHT_BLUE}
                          name="MobileNo"
                          value={formData.MobileNo}
                          onChange={handleChange}
                          error={!!errors.MobileNo}
                          errorMessage={errors.MobileNo}
                        />
                      </Grid>
                      <Grid item xs={12} md={6} lg={6}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: PRIMARY_BLUE2,
                            fontFamily: "Manrope",
                            fontWeight: 400,
                            fontSize: "10px",
                            lineHeight: "13.66px",
                            letterSpacing: "4%",
                            mb: 1,
                            textTransform: "uppercase"
                          }}
                        >
                          Email <Required />
                        </Typography>
                        <NuralTextField
                          width="100%"
                          placeholder="Email"
                          backgroundColor={LIGHT_BLUE}
                          name="Email"
                          value={formData.Email}
                          onChange={handleChange}
                          error={!!errors.Email}
                          errorMessage={errors.Email}
                        />
                      </Grid>
                      <Grid item xs={12} md={6} lg={6}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: PRIMARY_BLUE2,
                            fontFamily: "Manrope",
                            fontWeight: 400,
                            fontSize: "10px",
                            lineHeight: "13.66px",
                            letterSpacing: "4%",
                            mb: 1,
                            textTransform: "uppercase"
                          }}
                        >
                          UserName <Required />
                        </Typography>
                        <NuralTextField
                          width="100%"
                          placeholder="UserName"
                          backgroundColor={LIGHT_BLUE}
                          name="UserName"
                          value={formData.UserName}
                          onChange={handleChange}
                          error={!!errors.UserName}
                          errorMessage={errors.UserName}
                        />
                      </Grid>
                      <Grid item xs={12} md={6} lg={6}>
                        <Typography
                          variant="h6"
                          sx={{
                            color: PRIMARY_BLUE2,
                            fontFamily: "Manrope",
                            fontWeight: 400,
                            fontSize: "10px",
                            lineHeight: "13.66px",
                            letterSpacing: "4%",
                            mb: 1,
                            textTransform: "uppercase"
                          }}
                        >
                          Password <Required />
                        </Typography>
                        <NuralTextField
                          width="100%"
                          placeholder="Password"
                          backgroundColor={LIGHT_BLUE}
                          name="Password"
                          value={formData.Password}
                          onChange={handleChange}
                          error={!!errors.Password}
                          errorMessage={errors.Password}
                        />
                      </Grid>
                    </Grid>

                    <Grid container spacing={2} mt={1}>
                      <Grid item xs={12}>
                        <NuralButton
                          text="ADD CONTACT +"
                          color={"white"}
                          backgroundColor={PRIMARY_BLUE2}
                          variant="contained"
                          // onClick={handlePost}
                          width="100%"
                        />
                      </Grid>
                    </Grid>
                  </NuralAccordion2>
                  {accordionExpanded && (
                    <Grid container spacing={1} mt={1}>
                      <Grid item xs={12} md={6} lg={6}>
                        <NuralButton
                          text="CANCEL"
                          variant="outlined"
                          borderColor={PRIMARY_BLUE2}
                          onClick={handleCancel}
                          width="100%"
                        />
                      </Grid>
                      <Grid item xs={12} md={6} lg={6}>
                        <NuralButton
                          text={formData.CallType === 0 ? "CREATE" : "UPDATE"}
                          backgroundColor={AQUA}
                          variant="contained"
                          onClick={formData.CallType === 0 ? handlePost : updateAgencyMaster}
                          width="100%"
                        />
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>

            {/* Action Buttons */}

          </Grid>
        </Grid>
      )}
    </>
  );
};

export default AddAgancy;
