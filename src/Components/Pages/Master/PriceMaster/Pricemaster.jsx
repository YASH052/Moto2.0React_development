import {
  Grid,
  Typography,
  Checkbox,
  Box,
  Button,
  FormHelperText,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import {
  AQUA,
  DARK_PURPLE,
  LIGHT_BLUE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  PRIMARY_BLUE,
  WHITE,
  BLACK,
  MEDIUM_BLUE,
  PRIMARY_LIGHT_GRAY,
} from "../../../Common/colors";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
// import NuralAccordion from "../../NuralCustomComponents/NuralAccordion";
import NuralTextField from "../../NuralCustomComponents/NuralTextField";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";

import { useNavigate } from "react-router-dom";
import PriceListName from "./PriceListName";
import PriceListView from "./PriceListView";
import {
  Countrymasterlist,
  GetPriceListAPI,
  GetStateListForDropdown,
  ManagePriceListWithMappingAPI,
} from "../../../Api/Api";
import StatusModel from "../../../Common/StatusModel";
import Required from "../../../Common/Required";
const tabs = [
  { label: "Upload", value: "product-bulk-upload" },
  { label: "Brand", value: "brand" },
  { label: "Category", value: "category" },
  { label: "Sub Category", value: "sub-category" },
  { label: "Model", value: "model" },
  { label: "Color", value: "color" },
  { label: "SKU", value: "sku" },
  { label: "Focus Model", value: "focusModel" },
  { label: "Price", value: "price" },
  { label: "Pre Booking", value: "prebooking-sku-create" },
];
const ListItem = [
  {
    value: 1,
    label: "COUNTRY",
  },
  {
    value: 2,
    label: "STATE",
  },
];
const options = ["Country 1", "Country 2", "Country 3"];

// Add this constant for state options
const stateOptions = ["State 1", "State 2", "State 3", "State 4"];

const Pricemaster = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState("price");
  const [selectedValue, setSelectedValue] = useState("COUNTRY");
  const [countryDrop, setCountryDrop] = useState([]);
  const [stateDrop, setStateDrop] = useState([]);
  const [priceListNameDropdown, setPriceListNameDropdown] = useState([]);
  const [selectedMappings, setSelectedMappings] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [showStatus, setShowStatus] = useState(false);
  const [status, setStatus] = useState(false);
  const [title, setTitle] = useState("");
  const [accordionExpanded, setAccordionExpanded] = React.useState(true);

  const [errors, setErrors] = useState({
    priceListType: "",
    country: "",
    priceListName: "",
    mappings: "",
  });

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  const [formData, setFormData] = useState({
    type: 1 /* 1: Create, 2: Update, 3: Status Update */,
    priceListType: null /* 1:Country, 2:State */,
    priceListID: 0,
    priceListName: "",
    priceMappingList: [
      {
        mappingID: "",
      },
    ],
  });

  const resetForm = () => {
    setErrors({});
    // Reset form data to initial state
    setFormData({
      type: 1,
      priceListType: null,
      priceListID: 0,
      priceListName: "",

      priceMappingList: [
        {
          mappingID: "",
        },
      ],
    });

    // Reset other states
    setSelectedValue("COUNTRY");
    setSelectedMappings([]);

    // Reset dropdowns
    setCountryDrop([]);
    setStateDrop([]);

    // Fetch fresh country data
    fetchCountryDrop();
  };

  const handleChange = (field, value, newValue) => {
    if (field === "priceListType") {
      setSelectedValue(newValue?.label || "COUNTRY");
      // Reset country and state when price list type changes
      setFormData((prev) => ({
        ...prev,
     
        priceMappingList: [],
      }));
    }
    if (field === "country") {
      setSelectedValue("STATE");
    }
    setFormData({ ...formData, [field]: value });
  };

  const handleMappingChange = (id, isSelected) => {
    let newMappings;
    if (isSelected) {
      newMappings = [...selectedMappings, id];
    } else {
      newMappings = selectedMappings.filter((mappingId) => mappingId !== id);
    }
    setSelectedMappings(newMappings);
    setFormData((prev) => ({
      ...prev,
      priceMappingList: newMappings.map((id) => ({ mappingID: id })),
    }));
  };

  const handleSelectAll = () => {
    const allIds =
      selectedValue === "COUNTRY"
        ? countryDrop.map((country) => country.countryID)
        : stateDrop.map((state) => state.stateID);

    if (isAllSelected) {
      // If all are selected, deselect all
      setSelectedMappings([]);
      setFormData((prev) => ({
        ...prev,
        priceMappingList: [],
      }));
    } else {
      // If not all are selected, select all
      setSelectedMappings(allIds);
      setFormData((prev) => ({
        ...prev,
        priceMappingList: allIds.map((id) => ({ mappingID: id })),
      }));
    }
    setIsAllSelected(!isAllSelected);
  };

  useEffect(() => {
    fetchCountryDrop();
  }, []);

  useEffect(() => {
    if (formData.country) {
      fetchStateDrop();
    }
  }, [formData.country]);

  const fetchCountryDrop = async () => {
    let body = {
      CountryName: "",
      CallType: "1", // 0 = bind for table data, 1= active lists for dropdown*/
      pageIndex: 1 /*-1 for export to excel */,
      pageSize: 10,
    };
    try {
      let res = await Countrymasterlist(body);
      if (res.statusCode == 200) {
        setCountryDrop(res.countryMasterList);
      } else {
        setCountryDrop([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchStateDrop = async () => {
    let body = {
      countryID: formData.country,
      regionID: 0,
      stateID: 0,
    };
    try {
      let res = await GetStateListForDropdown(body);
      if (res.statusCode == 200) {
        setStateDrop(res.stateDropdownList);
      } else {
        setStateDrop([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const validateForm = () => {
    let newErrors = {
      priceListType: "",
      country: "",
      priceListName: "",
      mappings: "",
    };
    let isValid = true;

    if (!formData.priceListType) {
      newErrors.priceListType = "Please select Price List Type";
      isValid = false;
    }

    if (selectedValue === "STATE" && !formData.country) {
      newErrors.country = "Please select Country";
      isValid = false;
    }

    if (!formData.priceListName.trim()) {
      newErrors.priceListName = "Please enter Price List Name";
      isValid = false;
    }

    if (selectedMappings.length === 0) {
      newErrors.mappings = "Please select at least one item";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handlePost = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      let res = await ManagePriceListWithMappingAPI(formData);
      if (res.statusCode == 200) {
        setShowStatus(true);
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
        setTimeout(()=>{
          setShowStatus(false);
        },3000)
        resetForm();
      } else if (res.statusCode == 400 && res.invalidDataLink) {
        window.location.href = res.invalidDataLink;
        setShowStatus(true);
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
      } else {
        setShowStatus(true);
        setStatus(res.statusCode);
        setTitle(res.statusMessage);
      }
    } catch (error) {
      setShowStatus(true);
      setStatus(error.status || 500);
      setTitle(error.message || "Internal Server Error");
      console.log(error);
    }
  };

  return (
    <>
      <Grid container spacing={0}>
        {" "}
        <Grid
          item
          xs={12}
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 10000,
            backgroundColor: "#fff",
            paddingBottom: 1,
          }}
        >
          <Grid item xs={12} mt={3} mb={0} ml={1}>
            <BreadcrumbsHeader pageTitle="Product" />
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
          <Grid item xs={12} md={12} lg={12} sx={{ pr: 2 }}>
            <Grid container spacing={2} direction="column">
              <Grid item>
                <NuralAccordion2
                  title="Create Price List Name"
                  backgroundColor={LIGHT_GRAY2}
                  controlled={true}
                  expanded={accordionExpanded}
                  onChange={(event, expanded) => setAccordionExpanded(expanded)}
                >
                  <Grid container spacing={2} sx={{ width: "100%" }}>
                    {/* First Dropdown */}
                    <Grid item xs={12} sm={6} md={6} lg={6}>
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
                        PRICE LIST TYPE <Required />
                      </Typography>
                      <NuralAutocomplete
                        options={ListItem}
                        getOptionLabel={(option) => option.label}
                        placeholder="SELECT"
                        width="100%"
                        backgroundColor={LIGHT_BLUE}
                        onChange={(event, newValue) => {
                          handleChange(
                            "priceListType",
                            newValue?.value || null,
                            newValue
                          );
                          setErrors((prev) => ({ ...prev, priceListType: "" }));
                        }}
                        value={
                          ListItem.find(
                            (option) => option.value === formData.priceListType
                          ) || null
                        }
                        error={!!errors.priceListType}
                      />
                      {errors.priceListType && (
                        <FormHelperText error sx={{ ml: 2 }}>
                          {errors.priceListType}
                        </FormHelperText>
                      )}
                    </Grid>

                    {/* Country Dropdown - Show when STATE is selected */}
                    {selectedValue === "STATE" && (
                      <Grid item xs={12} sm={6} md={6} lg={6}>
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
                          COUNTRY <Required />
                        </Typography>
                        <NuralAutocomplete
                          options={countryDrop}
                          getOptionLabel={(option) => option.countryName}
                          onChange={(event, newValue) => {
                            handleChange(
                              "country",
                              newValue?.countryID || null,
                              newValue
                            );
                            setErrors((prev) => ({ ...prev, country: "" }));
                          }}
                          value={
                            countryDrop.find(
                              (option) => option.countryID === formData.country
                            ) || null
                          }
                          placeholder="SELECT COUNTRY"
                          width="100%"
                          backgroundColor={LIGHT_BLUE}
                          error={!!errors.country}
                        />
                        {errors.country && (
                          <FormHelperText error sx={{ ml: 2 }}>
                            {errors.country}
                          </FormHelperText>
                        )}
                      </Grid>
                    )}

                    {/* Price List Name field */}
                    {selectedValue === "COUNTRY" && (
                      <Grid item xs={12} sm={6} md={6} lg={6}>
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
                          PRICE LIST NAME <Required />
                        </Typography>
                        <NuralTextField
                          width="100%"
                          value={formData.priceListName}
                          onChange={(e) => {
                            handleChange("priceListName", e.target.value);
                            setErrors((prev) => ({
                              ...prev,
                              priceListName: "",
                            }));
                          }}
                          placeholder="XXXXXXXXXXXXX"
                          backgroundColor={LIGHT_BLUE}
                          error={!!errors.priceListName}
                          helperText={errors.priceListName}
                        />
                      </Grid>
                    )}
                    {selectedValue === "STATE" && (
                      <Grid item xs={12} sm={12} md={12} lg={12}>
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
                          PRICE LIST NAME <Required />
                        </Typography>
                        <NuralTextField
                          width="100%"
                          value={formData.priceListName}
                          onChange={(e) => {
                            handleChange("priceListName", e.target.value);
                            setErrors((prev) => ({
                              ...prev,
                              priceListName: "",
                            }));
                          }}
                          placeholder="XXXXXXXXXXXXX"
                          backgroundColor={LIGHT_BLUE}
                          error={!!errors.priceListName}
                          helperText={errors.priceListName}
                        />
                      </Grid>
                    )}
                  </Grid>

                  <Grid container spacing={2} sx={{ width: "100%" }}>
                    <Grid item xs={12} md={12} lg={12}>
                      <Box
                        sx={{
                          width: "100%",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: 2,
                          mb: 2,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            color: PRIMARY_BLUE2,
                            fontFamily: "Manrope",
                            fontWeight: 700,
                            fontSize: "10px",
                            lineHeight: "13.66px",
                            letterSpacing: "4%",
                            textAlign: "center",
                          }}
                        >
                          {selectedValue === "STATE"
                            ? "STATE MAPPING"
                            : "COUNTRY MAPPING"}{" "}
                          <Required />
                        </Typography>

                        <Typography
                          variant="h6"
                          onClick={handleSelectAll}
                          sx={{
                            color: PRIMARY_BLUE2,
                            fontFamily: "Manrope",
                            fontWeight: 700,
                            fontSize: "10px",
                            lineHeight: "13.66px",
                            letterSpacing: "4%",
                            textAlign: "center",
                            cursor: "pointer",
                          }}
                        >
                          {isAllSelected ? "DESELECT ALL" : "SELECT ALL"}
                        </Typography>
                      </Box>

                      <Grid
                        container
                        spacing={2}
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        {(selectedValue === "STATE"
                          ? stateDrop
                          : countryDrop
                        ).map((option) => (
                          <Grid
                            item
                            xs={6}
                            sm={3}
                            md={2}
                            lg={2}
                            key={
                              selectedValue === "STATE"
                                ? option.stateID
                                : option.countryID
                            }
                            sx={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Checkbox
                              checked={selectedMappings.includes(
                                selectedValue === "STATE"
                                  ? option.stateID
                                  : option.countryID
                              )}
                              onChange={(e) => {
                                handleMappingChange(
                                  selectedValue === "STATE"
                                    ? option.stateID
                                    : option.countryID,
                                  e.target.checked
                                );
                                setErrors((prev) => ({
                                  ...prev,
                                  mappings: "",
                                }));
                              }}
                              sx={{
                                "&.Mui-checked": {},
                                borderRadius: "4px",
                              }}
                            />

                            <Typography
                              sx={{
                                color: selectedMappings.includes(
                                  selectedValue === "STATE"
                                    ? option.stateID
                                    : option.countryID
                                )
                                  ? WHITE
                                  : BLACK,
                                backgroundColor: selectedMappings.includes(
                                  selectedValue === "STATE"
                                    ? option.stateID
                                    : option.countryID
                                )
                                  ? PRIMARY_BLUE
                                  : "transparent",
                                padding: "8px",
                                borderRadius: "4px",
                                fontSize: "12px",
                                fontWeight: 500,
                                width: "260px",
                                textAlign: "start",
                              }}
                            >
                              {selectedValue === "STATE"
                                ? option.stateName
                                : option.countryName}
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                      {errors.mappings && (
                        <Typography
                          sx={{
                            color: "error.main",
                            fontSize: "12px",
                            mt: 1,
                            ml: 2,
                          }}
                        >
                          {errors.mappings}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                </NuralAccordion2>
              </Grid>
            </Grid>
            <Grid item xs={12} md={12} lg={12} pr={2} mt={2}>
              {showStatus && (
                <StatusModel width="100%" status={status} title={title} />
              )}
            </Grid>
          </Grid>

          {/* Action Buttons */}
          {accordionExpanded && (
            <Grid container spacing={1} sx={{ margin: 2, mt: 0 }}>
              <Grid item xs={12} md={6} sm={6} lg={6}>
                <NuralButton
                  text="CANCEL"
                  variant="outlined"
                  borderColor={PRIMARY_BLUE2}
                  onClick={() => {
                    resetForm();
                    setShowStatus(false);
                  }}
                  width="100%"
                />
              </Grid>
              <Grid item xs={12} md={6} lg={6}>
                <NuralButton
                  text="SAVE"
                  backgroundColor={AQUA}
                  variant="contained"
                  onClick={handlePost}
                  width="100%"
                />
              </Grid>
            </Grid>
          )}
          <PriceListName />
          <PriceListView />
        </Grid>
      </Grid>
    </>
  );
};

export default Pricemaster;
