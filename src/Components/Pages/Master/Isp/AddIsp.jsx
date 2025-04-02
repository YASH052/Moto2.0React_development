import { Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import NuralUploadFormat from "../../NuralCustomComponents/NuralUploadFormat";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import { FormSkeleton } from "../../../Common/Skeletons";
import {
  AQUA,
  DARK_PURPLE,
  LIGHT_BLUE,
  LIGHT_GRAY2,
  MEDIUM_BLUE,
  PRIMARY_BLUE2,
} from "../../../Common/colors";
import NuralFileUpload from "../../NuralCustomComponents/NuralFileUpload";
import NuralAccordion from "../../NuralCustomComponents/NuralAccordion";
import NuralUploadStatus from "../../NuralCustomComponents/NuralUploadStatus";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import NuralTextField from "../../NuralCustomComponents/NuralTextField";
import NuralRadioButton from "../../NuralCustomComponents/NuralRadioButton";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import { useNavigate } from "react-router-dom";
import {
  GetAgencyListDropdown,
  GetISPParentHierarchyList,
  getISPRetailerReferenceDataLink,
  GetRetailerListDrpdown,
  SaveUpdateISPData,
} from "../../../Api/Api";
import { createFilterOptions } from "@mui/material/Autocomplete";

const options = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const options2 = [
  "Nural Network",
  "Deep Learning",
  "Machine Learning",
  "Artificial Intelligence",
  "Computer Vision",
];

const filterOptions = createFilterOptions({
  matchFrom: "any",
  limit: 100,
  stringify: (option) => option.retailerCode + " " + option.retailerName,
});

const labelStyle = {
  fontSize: "10px",
  lineHeight: "13.66px",
  letterSpacing: "4%",
  color: PRIMARY_BLUE2,
  marginBottom: "5px",
  fontWeight: 400,
};

const AddIsp = () => {
  const [activeTab, setActiveTab] = React.useState("add-isp");
  const [tabbs, setTabbs] = React.useState([
    { label: "Org People", value: "org-people" },
    { label: "ISP", value: "add-isp" },
    { label: "Ranking Weightage", value: "ranking-weightage" },
    { label: "Salesman", value: "create-salesman" },
  ]);
  const [selectedFormat, setSelectedFormat] = React.useState("interface");
  const navigate = useNavigate();
  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  const [retailerList, setRetailerList] = useState([]);
  const [retailerListLoading, setRetailerListLoading] = useState(false);
  const [parentHierarchyList, setParentHierarchyList] = useState([]);
  const [agencyList, setAgencyList] = useState([]);
  const [formData, setFormData] = useState({
    ispId: 0, // 0= to add, ISPID to update
    password: "",
    userName: "",
    passwordExpiryDays: 90, // taken from configValue in DB
    createLoginOrNot: 1, // taken from configValue in DB
    email: "",
    companyID: 0,
    ispName: "",
    ispCode: "",
    mobile: "",
    retailerID: 0, //selected Retailer's ID
    storeCode: "",
    joiningDate: "", // YYYY-MM-DD
    fromDate: '', 
    weekOffDay: 1,
    parentHeirarchyID: 0,
    agencyID: 0,
  });
  const [isLoading, setIsLoading] = React.useState(true);

  const handleFormatChange = (value) => {
    console.log("Selected value:", value);
    setSelectedFormat(value);
    if (value === "interface") {
      navigate("/add-isp");
    } else if (value === "batch") {
      navigate("/isp-upload");
    }
  };

  const handleDownload = async () => {
    try {
      const params = {
        callType: 1, //0=Upload target reference data, 1=isp Retailer ref data
      };
      const response = await getISPRetailerReferenceDataLink(params);
      if (response.statusCode === "200") {
        window.location.href = response?.referenceDataLink;
      } else {
        console.log(response.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const templates = [
    {
      name: "Template 1",
      onView: () => console.log("Template 1"),
      onDownload: handleDownload,
    },
  ];
  const getRetailerListDrpdown = async () => {
    setRetailerListLoading(true);
    try {
      const params = {
        retailerID: 0,
      };
      const response = await GetRetailerListDrpdown(params);
      if (response.statusCode === "200") {
        setRetailerList(response.retailerMasterList);
      } else {
        console.error("Failed to fetch retailer list:", response.error);
        setRetailerList([]);
      }
    } catch (error) {
      console.error("Error fetching retailer list:", error);
      setRetailerList([]);
    } finally {
      setRetailerListLoading(false);
    }
  };

  const getParentHierarchyList = async () => {
    try {
      const response = await GetISPParentHierarchyList();
      if (response.statusCode === "200") {
        setParentHierarchyList(response.ispParentHierarchyList);
      } else {
        setParentHierarchyList([]);
      }
    } catch (error) {
      console.log(error);
      setParentHierarchyList([]);
    }
  };

  const getAgencyListDropdown = async () => {
    try {
      const response = await GetAgencyListDropdown();
      if (response.statusCode === "200") {
        setAgencyList(response.ispAgencyMasterList);
        console.log(response.ispAgencyMasterList);
      } else {
        setAgencyList([]);
      }
    } catch (error) {
      console.log(error);
      setAgencyList([]);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCancel = async () => {
    setIsLoading(true); // Show skeleton while reloading
    setFormData({
      ispId: 0,
      password: "",
      userName: "",
      passwordExpiryDays: 90,
      createLoginOrNot: 1,
      email: "",
      companyID: 0,
      ispName: "",
      ispCode: "",
      mobile: "",
      retailerID: 0,
      storeCode: "",
      joiningDate: "",
      fromDate: "",
      weekOffDay: 1,
      parentHeirarchyID: 0,
      agencyID: 0,
    });

    try {
      // Reload all data
      await Promise.all([
        getRetailerListDrpdown(),
        getParentHierarchyList(),
        getAgencyListDropdown()
      ]);
    } catch (error) {
      console.error("Error reloading data:", error);
    } finally {
      setIsLoading(false); // Hide skeleton after reload completes
    }
  };

  const handlePostRequest = async () => {
    try {
      const response = await SaveUpdateISPData(formData);
      if (response.statusCode === "200") {
        alert("ISP Data Saved Successfully");
      } else {
        alert("ISP Data Save Failed");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          getRetailerListDrpdown(),
          getParentHierarchyList(),
          getAgencyListDropdown(),
        ]);
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  return (
    <Grid container spacing={0}>
      <Grid
        item
        xs={12}
        md={6}
        lg={12}
        mt={3}
        mb={0}
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1200,
          backgroundColor: "#fff",
          ml: 1,
          pb: 1,
        }}
      >
        <BreadcrumbsHeader pageTitle="ISP" />
      </Grid>

      <Grid
        item
        xs={12}
        md={6}
        lg={12}
        sx={{
          position: "sticky",
          top: "48px",
          zIndex: 1200,
          backgroundColor: "#fff",
          pb: 1,
          ml: 1,
        }}
      >
        <TabsBar
          tabs={tabbs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </Grid>

      {isLoading ? (
        <Grid container spacing={0} lg={12} mt={1}>
          <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
            <FormSkeleton />
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={0} lg={12} mt={1}>
          <Grid item xs={12} md={6} lg={6} sx={{ pr: 2 }}>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <NuralAccordion2
                  title="Store Details"
                  backgroundColor={LIGHT_GRAY2}
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
                      mb: 3,
                    }}
                  >
                    Store Details
                  </Typography>
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
                        }}
                      >
                        RETAILER CODE
                      </Typography>
                      <NuralAutocomplete
                        options={retailerList}
                        getOptionLabel={(option) => option.retailerCode || ""}
                        isOptionEqualToValue={(option, value) =>
                          option?.retailerId === value?.retailerId
                        }
                        value={
                          retailerList.find(
                            (item) => item.retailerId === formData.retailerID
                          ) || null
                        }
                        onChange={(event, newValue) => {
                          handleChange("retailerID", newValue?.retailerId || 0);
                        }}
                        placeholder="SELECT"
                        width="100%"
                        backgroundColor={LIGHT_BLUE}
                        loading={retailerListLoading}
                        filterOptions={filterOptions}
                      />
                    </Grid>

                    <Grid item xs={12} md={6} lg={6}>
                      <Typography
                        variant="h6"
                        sx={{
                          ml: 2,
                          color: PRIMARY_BLUE2,
                          fontFamily: "Manrope",
                          fontWeight: 400,
                          fontSize: "10px",
                          lineHeight: "13.66px",
                          letterSpacing: "4%",
                        }}
                      >
                        SELECT MODE
                      </Typography>
                      <Grid item xs={12} md={12} lg={12} ml={2} mt={1}>
                        <NuralRadioButton
                          onChange={handleFormatChange}
                          options={[
                            { value: "interface", label: "Interface" },
                            { value: "batch", label: "Batch" },
                          ]}
                          value={selectedFormat}
                          width="100%"
                          gap="5px"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid container spacing={2} mt={1}>
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
                        }}
                      >
                        RETAILER NAME
                      </Typography>
                      <NuralAutocomplete
                        options={retailerList}
                        getOptionLabel={(option) => option.retailerName || ""}
                        isOptionEqualToValue={(option, value) =>
                          option?.retailerId === value?.retailerId
                        }
                        value={
                          retailerList.find(
                            (item) => item.retailerId === formData.retailerID
                          ) || null
                        }
                        onChange={(event, newValue) => {
                          handleChange("retailerID", newValue?.retailerId || 0);
                        }}
                        placeholder="SELECT"
                        width="100%"
                        backgroundColor={LIGHT_BLUE}
                        loading={retailerListLoading}
                        filterOptions={filterOptions}
                      />
                    </Grid>

                    <Grid item xs={12} md={6} lg={6}>
                      <Typography
                        variant="h6"
                        sx={{
                          ml: 2,
                          color: PRIMARY_BLUE2,
                          fontFamily: "Manrope",
                          fontWeight: 400,
                          fontSize: "10px",
                          lineHeight: "13.66px",
                          letterSpacing: "4%",
                        }}
                      >
                        REPORTING HIERARCHY
                      </Typography>
                      <Grid item xs={12} md={12} lg={12} ml={2} mt={1}>
                        <NuralAutocomplete
                          options={parentHierarchyList}
                          getOptionLabel={(option) => option.orgnHierarchyName || ""}
                          isOptionEqualToValue={(option, value) =>
                            option?.orgnHierarchyID === value?.orgnHierarchyID
                          }
                          value={
                            parentHierarchyList.find(
                              (item) =>
                                item.orgnHierarchyID === formData.parentHeirarchyID
                            ) || null
                          }
                          onChange={(event, newValue) => {
                            handleChange(
                              "parentHeirarchyID",
                              newValue?.orgnHierarchyID || 0
                            );
                          }}
                          placeholder="SELECT"
                          width="100%"
                          backgroundColor={LIGHT_BLUE}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </NuralAccordion2>
                <Grid item mt={2}>
                  <NuralAccordion
                    titleColor={DARK_PURPLE}
                    backgroundColor={LIGHT_GRAY2}
                    buttonColor={PRIMARY_BLUE2}
                    buttonBg={MEDIUM_BLUE}
                    width="100%"
                    referenceIcon1={"./Icons/downloadIcon.svg"}
                    referenceIcon2={"./Icons/downloadIcon.svg"}
                    title="Reference Data"
                    buttons={false}
                    templates={templates}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} md={6} lg={6} sx={{ pr: 2, mt: { xs: 2, sm: 2, md: 0, lg: 0 } }}>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <NuralAccordion2
                  title="Personal Details"
                  backgroundColor={LIGHT_GRAY2}
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
                      mb: 3,
                    }}
                  >
                    Store Details
                  </Typography>
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
                        }}
                      >
                        ISP NAME
                      </Typography>
                      <NuralTextField
                        value={formData.ispName}
                        onChange={(e) => handleChange("ispName", e.target.value)}

                        width="100%"
                        placeholder="ENTER ISP NAME"
                        backgroundColor={LIGHT_BLUE}
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
                        }}
                      >
                        ISP CODE
                      </Typography>
                      <NuralTextField
                        value={formData.ispCode}
                        onChange={(e) => handleChange("ispCode", e.target.value)}
                        width="100%"
                        placeholder="ENTER ISP CODE"
                        backgroundColor={LIGHT_BLUE}
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
                        }}
                      >
                        MOBILE NO.
                      </Typography>
                      <NuralTextField
                        value={formData.mobile}
                        onChange={(e) => handleChange("mobile", e.target.value)}
                        width="100%"
                        placeholder="ENTER MOBILE NO."
                        backgroundColor={LIGHT_BLUE}
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
                        }}
                      >
                        EMAIL ID
                      </Typography>
                      <NuralTextField
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        width="100%"
                        placeholder="ENTER EMAIL ID"
                        backgroundColor={LIGHT_BLUE}
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
                        }}
                      >
                        JOINING DATE
                      </Typography>
                      <NuralTextField
                        value={formData.joiningDate}
                        onChange={(e) => handleChange("joiningDate", e.target.value)}
                        width="100%"
                        placeholder="01/01/24"
                        backgroundColor={LIGHT_BLUE}
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
                        }}
                      >
                        AGENCY
                      </Typography>
                      <NuralAutocomplete
                        options={agencyList}
                        getOptionLabel={(option) => option.agencyName || ""}
                        isOptionEqualToValue={(option, value) =>
                          option?.agencyId === value?.agencyId
                        }
                        value={
                          agencyList.find(
                            (item) => item.agencyId === formData.agencyID
                          ) || null
                        }
                        onChange={(event, newValue) => {
                          handleChange("agencyID", newValue?.agencyId || 0);
                        }}
                        placeholder="SELECT"
                        width="100%"
                        backgroundColor={LIGHT_BLUE}
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
                        }}
                      >
                        USER NAME
                      </Typography>
                      <NuralTextField
                        value={formData.userName}
                        onChange={(e) => handleChange("userName", e.target.value)}
                        width="100%"
                        placeholder="ENTER USER NAME"
                        backgroundColor={LIGHT_BLUE}
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
                        }}
                      >
                        PASSWORD
                      </Typography>
                      <NuralTextField
                        value={formData.password}
                        onChange={(e) => handleChange("password", e.target.value)}
                        width="100%"
                        placeholder="ENTER PASSWORD"
                        backgroundColor={LIGHT_BLUE}
                      />
                    </Grid>
                  </Grid>
                </NuralAccordion2>
              </Grid>

              <Grid item>
                <Grid container spacing={1}>
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
                      text="PROCEED"
                      backgroundColor={AQUA}
                      variant="contained"
                      onClick={handlePostRequest}
                      width="100%"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default AddIsp;
