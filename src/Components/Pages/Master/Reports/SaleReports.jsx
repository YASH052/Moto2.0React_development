import { Grid, Typography, Button, Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import {
  AQUA,
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  PRIMARY_LIGHT_GRAY,
  SKELETON_GRAY,
} from "../../../Common/colors";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import NuralCalendar from "../../NuralCustomComponents/NuralCalendar";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import NuralTextButton from "../../NuralCustomComponents/NuralTextButton";

import {
  GetSalerseport,
  GetSalestype,
  Regionmasterlist,
  StateList,
} from "../../../Api/Api";
import { MenuConstants } from "../../../Common/MenuConstants";
import {
  getCurrentMonthFirstDate,
  getTodayDate,
} from "../../../Common/commonFunction";
import { FormSkeleton } from "../../../Common/Skeletons";
import StatusModel from "../../../Common/StatusModel";
import { useNavigate } from "react-router-dom";
const tabs = [
  { label: "Sale Report", value: "sale-report" },
  { label: "ISP Sales Report", value: "isp-sales-report" },
  { label: "Unique Sales Report", value: "unique-sales-report" },
  { label: "Primary to Tertiary Track", value: "primary-to-tertiary" },
  { label: "Competition Sales Report", value: "competition-sales-report" },
];

const labelStyle = {
  fontSize: "10px",
  lineHeight: "13.66px",
  letterSpacing: "4%",
  color: DARK_PURPLE,
  marginBottom: "5px",
  fontWeight: 400,
};



const SaleReports = () => {
  const navigate = useNavigate();
  const generateDummyData = () => {
    const regions = ["North", "South", "East", "West", "Central"];
    const states = [
      "Maharashtra",
      "Gujarat",
      "Karnataka",
      "Tamil Nadu",
      "Delhi",
    ];
    const saleTypes = ["Direct", "Distributor", "Online", "Retail"];
    const serialTypes = ["A123", "B456", "C789", "D012", "E345"];

    return Array(50)
      .fill()
      .map((_, index) => ({
        id: `${1000 + index}`,
        column1: saleTypes[Math.floor(Math.random() * saleTypes.length)],
        column2: regions[Math.floor(Math.random() * regions.length)],
        column3: states[Math.floor(Math.random() * states.length)],
        column4: new Date(
          2024,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1
        ).toLocaleDateString(),
        column5: Math.floor(Math.random() * 10000000),
        column6: serialTypes[Math.floor(Math.random() * serialTypes.length)],
        column7: `Product-${Math.floor(Math.random() * 100)}`,
        column8: Math.floor(Math.random() * 100),
        column9: `Status-${Math.floor(Math.random() * 3)}`,
      }));
  };
  const [state, setState] = useState([]);

  const [activeTab, setActiveTab] = React.useState("sale-report");
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [salesType, setSalesType] = React.useState([]);
  const [rows, setRows] = React.useState(generateDummyData());
  const [filteredRows, setFilteredRows] = React.useState(rows);
  const [selectedSaleType, setSelectedSaleType] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [region, setRegion] = useState([]);
  const [defaultLoading, setDefaultLoading] = React.useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [code, setcode] = useState("");
  const [showStatus, setShowStatus] = useState(false);

  const [searchParams, setSearchParams] = useState({
    datefrom: getCurrentMonthFirstDate(),
    dateTo: getTodayDate(),
    salesChannelID: 0,
    salesType: 0,
    filepath: "",
    modelId: 0,
    skuId: 0,
    stateId: 0,
    productCategoryId: 0,
    orgnHierarchyId: 0,
    wantZeroQuantity: 0,
    withOrWithoutSerialBatch: 0,
    comingFrom: 0,
    cityId: 0,
  });

  const serialTypeOptions = [
    { id: 0, name: "Without Serial" },
    { id: 1, name: "With Serial" },
  ];

  const [dateError, setDateError] = useState("");

  const handleStatus = (code, message) => {
    console.log("code", code);
    setStatusMessage(message);
    setcode(code);
    setShowStatus(true);
    // setTimeout(() => setShowStatus(false), 3000);
  };

  useEffect(() => {
    const fetchData = async () => {
      setDefaultLoading(true);
      setIsLoading(true);
      try {
        await Promise.all([fetchSalesType(), fetchRegion(), fetchState()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
        setDefaultLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchState = async () => {
    setIsLoading(true);
    let body = {
      State: "",
      CountryID: 0,
      RegionID: 0,
      PageIndex: 1,
      PageSize: 10,
      StateID: 0,
      CallType: 1,
    };
    try {
      const response = await StateList(body);
      if (response.statusCode == 200) {
        setState(response.stateMasterList);
      }
    } catch (error) {
      console.error("Error fetching state:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRegion = async () => {
    setIsLoading(true);
    let body = {
      Region: "",
      CallType: 1,
      pageIndex: 1,
      pageSize: 10,
      CountryID: 0,
    };
    try {
      const response = await Regionmasterlist(body);
      if (response.statusCode == 200) {
        setRegion(response.regionMasterList);
      }
    } catch (error) {
      console.error("Error fetching region:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSalesType = async () => {
    setIsLoading(true);
    let body = {
      salesChannelTypeId: 0,
      hierarchyLevelID: 0,
    };
    try {
      const response = await GetSalestype(body);
      if (response.statusCode == 200) {
        setSalesType(response.saletypelist);
      }
    } catch (error) {
      console.error("Error fetching sales type:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (field, value, selectedOption = null) => {
    setSearchParams((prev) => ({
      ...prev,
      [field]: value,
    }));

    switch (field) {
      case "salesType":
        setSelectedSaleType(selectedOption);
        break;
      case "stateId":
        setSelectedState(selectedOption);
        break;
      default:
        break;
    }
  };

  const handleSearch = async () => {
    setShowStatus(false);
    setDefaultLoading(true);
    setIsLoading(true);
    const formattedParams = {
      ...searchParams,
      datefrom: searchParams.datefrom
        ? new Date(searchParams.datefrom.setHours(12, 0, 0, 0))
            .toISOString()
            .split("T")[0]
        : null,
      dateTo: searchParams.dateTo
        ? new Date(searchParams.dateTo.setHours(12, 0, 0, 0))
            .toISOString()
            .split("T")[0]
        : null,
      salesType: selectedSaleType?.salesTypeID || 1,
      stateId: selectedState?.stateID || 0,
    };

    try {
      let res = await GetSalerseport(formattedParams);
      if (res.statusCode == 200) {
        window.location.href = res.filepathlink;
        handleStatus(res.statusCode, res.statusMessage);
      } else {
        handleStatus(res.statusCode, res.statusMessage);
      }
    } catch (error) {
      
      console.log(error);
      handleStatus(
        error.response.data.status,
        MenuConstants.somethingWentWrong
      );
    } finally {
      setIsLoading(false);
     
      setDefaultLoading(false);
    }
  };

  const handleFromDateChange = (newValue) => {
    console.log("newValue", newValue);
    setDateError("");
    if (searchParams.dateTo && newValue > searchParams.dateTo) {
      setDateError("From date cannot be greater than To date");
      return;
    }
    handleSearchChange("datefrom", newValue);
  };

  const handleToDateChange = (newValue) => {
    setDateError("");
    if (searchParams.datefrom && newValue < searchParams.datefrom) {
      setDateError("To date cannot be less than From date");
      return;
    }
    handleSearchChange("dateTo", newValue);
  };

  const initialSearchParams = {
    datefrom: getCurrentMonthFirstDate(),
    dateTo: getTodayDate(),
    salesChannelID: 0,
    salesType: 0,
    filepath: "",
    modelId: 0,
    skuId: 0,
    stateId: 0,
    productCategoryId: 0,
    orgnHierarchyId: 0,
    wantZeroQuantity: 0,
    withOrWithoutSerialBatch: null,
    comingFrom: 0,
    cityId: 0,
  };

  const handleCancel = () => {
    setSearchParams(initialSearchParams);
    setSelectedSaleType(null);
    setSelectedState(null);
    setDateError("");
    setStatusMessage("");
    setcode("");
    setShowStatus(false);
  };
  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  return (
    <Grid container spacing={2} sx={{ position: "relative" }}>
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
        <Grid item xs={12} mt={1} mb={0} ml={1}>
          <BreadcrumbsHeader pagecode="Reports" />
        </Grid>

        <Grid item xs={12} ml={1}>
          <TabsBar
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </Grid>
      </Grid>

      <Grid
        container
        spacing={0}
        lg={12}
        mt={1}
        sx={{ position: "relative", zIndex: 1 }}
      >
        {defaultLoading ? (
          <FormSkeleton />
        ) : (
          <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <NuralAccordion2
                  code="Sale Report"
                  backgroundColor={LIGHT_GRAY2}
                >
                  <>
                    <Grid
                      container
                      spacing={2}
                      mb={2}
                      sx={{
                        gap: { xs: 2, sm: 3, md: 0 },
                        flexDirection: { xs: "column", sm: "row" },
                      }}
                    >
                      <Grid item xs={12} sm={5} md={4}>
                        <Typography
                          variant="body1"
                          sx={{
                            ...labelStyle,
                            fontSize: { xs: "12px", sm: "10px" },
                          }}
                          fontWeight={600}
                        >
                          SALE TYPE
                        </Typography>
                        <NuralAutocomplete
                          label="Sale Type"
                          options={salesType}
                          placeholder="SELECT"
                          width="100%"
                          getOptionLabel={(option) =>
                            option.salesTypeName || ""
                          }
                          isOptionEqualToValue={(option, value) =>
                            option?.salesTypeID === value?.salesTypeID
                          }
                          onChange={(event, newValue) => {
                            handleSearchChange(
                              "salesType",
                              newValue?.salesTypeID || 1,
                              newValue
                            );
                          }}
                          value={
                            salesType.find(
                              (option) =>
                                option.salesTypeID === searchParams.salesType
                            ) || null
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={5} md={4}>
                        <Typography
                          variant="body1"
                          sx={{
                            ...labelStyle,
                            fontSize: { xs: "12px", sm: "10px" },
                          }}
                          fontWeight={600}
                        >
                          STATE
                        </Typography>
                        <NuralAutocomplete
                          width="100%"
                          label="State"
                          options={state}
                          getOptionLabel={(option) => option.stateName || ""}
                          isOptionEqualToValue={(option, value) =>
                            option?.stateID === value?.stateID
                          }
                          onChange={(event, newValue) => {
                            handleSearchChange(
                              "stateId",
                              newValue?.stateID || 0,
                              newValue
                            );
                          }}
                          value={
                            state.find(
                              (option) =>
                                option.stateID === searchParams.stateId
                            ) || null
                          }
                          placeholder="SELECT"
                        />
                      </Grid>
                    </Grid>

                    <Grid
                      container
                      spacing={2}
                      mb={2}
                      sx={{
                        gap: { xs: 2, sm: 3, md: 0 },
                        flexDirection: { xs: "column", sm: "row" },
                      }}
                    >
                      <Grid item xs={12} sm={5} md={4}>
                        <Typography
                          variant="body1"
                          sx={{
                            ...labelStyle,
                            fontSize: { xs: "12px", sm: "10px" },
                          }}
                          fontWeight={600}
                        >
                          FROM DATE
                        </Typography>
                        <NuralCalendar
                          width="100%"
                          placeholder="DD/MMM/YY"
                          value={searchParams.datefrom}
                          onChange={handleFromDateChange}
                          error={!!dateError}
                        />
                      </Grid>
                      <Grid item xs={12} sm={5} md={4}>
                        <Typography
                          variant="body1"
                          sx={{
                            ...labelStyle,
                            fontSize: { xs: "12px", sm: "10px" },
                          }}
                          fontWeight={600}
                        >
                          TO DATE
                        </Typography>
                        <NuralCalendar
                          width="100%"
                          placeholder="DD/MMM/YY"
                          value={searchParams.dateTo}
                          onChange={handleToDateChange}
                          error={!!dateError}
                        />
                      </Grid>
                      {dateError && (
                        <Grid item xs={12}>
                          <Typography
                            color="error"
                            sx={{
                              fontSize: "12px",
                              mt: -1,
                            }}
                          >
                            {dateError}
                          </Typography>
                        </Grid>
                      )}
                      <Grid item xs={12} sm={5} md={4}>
                        <Typography
                          variant="body1"
                          sx={{
                            ...labelStyle,
                            fontSize: { xs: "12px", sm: "10px" },
                          }}
                          fontWeight={600}
                        >
                          SERIAL TYPE
                        </Typography>
                        <NuralAutocomplete
                          width="100%"
                          options={serialTypeOptions}
                          placeholder="SELECT"
                          getOptionLabel={(option) => option.name || ""}
                          isOptionEqualToValue={(option, value) =>
                            option?.id === value?.id
                          }
                          onChange={(event, newValue) => {
                            handleSearchChange(
                              "withOrWithoutSerialBatch",
                              newValue?.id || 0,
                              newValue
                            );
                          }}
                          value={
                            serialTypeOptions.find(
                              (option) =>
                                option.id ===
                                searchParams.withOrWithoutSerialBatch
                            ) || null
                          }
                        />
                      </Grid>
                    </Grid>

                    <Grid
                      container
                      spacing={2}
                      sx={{
                        flexDirection: { xs: "column", sm: "row" },
                      }}
                    >
                      <Grid item xs={12} sm={2} md={1}>
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
                      <Grid item xs={12} sm={9} md={11}>
                        <NuralTextButton
                          icon={"./Icons/searchIcon.svg"}
                          iconPosition="right"
                          height="36px"
                          backgroundColor={PRIMARY_BLUE2}
                          color="#fff"
                          width="100%"
                          fontSize="12px"
                          onClick={() => {
                            if (dateError) {
                              handleStatus(dateError, "error");
                              return;
                            }
                            handleSearch();
                          }}
                        >
                          SEARCH
                        </NuralTextButton>
                      </Grid>
                    </Grid>
                  </>
                </NuralAccordion2>
              </Grid>
            </Grid>
          </Grid>
        )}
      </Grid>
      <Grid item xs={12} pr={4} sx={{ position: "relative" }}>
        {showStatus && (
          <StatusModel width="100%" status={code} title={statusMessage} />
        )}
      </Grid>
    </Grid>
  );
};

export default SaleReports;
