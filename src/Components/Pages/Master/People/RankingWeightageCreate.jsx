import { Box, Grid, Grid2 } from "@mui/material";
import React, { useEffect, useState } from "react";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import { useNavigate } from "react-router-dom";
import TabsBar from "../../../Common/TabsBar";
import {
  AQUA,
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
} from "../../../Common/colors";
import NuralLoginTextField from "../../NuralCustomComponents/NuralLoginTextField";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import {
  fetchRankingWeightage,
  manageRankingWeightage,
} from "../../../Api/Api";
import StatusModel from "../../../Common/StatusModel";
import { FormSkeleton } from "../../../Common/Skeletons";
import { headTitle } from "../../../Common/commonstyles";

export const RankingWeightageCreate = () => {
  const [activeTab, setActiveTab] = React.useState("ranking-weightage");
  const navigate = useNavigate();
  const [tabbs, setTabbs] = React.useState([
    { label: "Org People", value: "org-people" },
    { label: "ISP", value: "add-isp" },
    { label: "Ranking Weightage", value: "ranking-weightage" },
    { label: "Salesman", value: "create-salesman" },
  ]);

  const [configItems, setConfigItems] = useState([]);
  const [status, setStatus] = useState(null);
  const [title, setTitle] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [totalWeightageError, setTotalWeightageError] = useState("");
  const [formLoading, setFormLoading] = useState(true);

  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };

  // Function to toggle edit mode for a specific item
  const toggleEditMode = (itemId) => {
    // First check if the item is already in edit mode
    const item = configItems.find((item) => item.skuGroupId === itemId);
    const isCurrentlyEditing = item?.isEditing || false;

    // Close all edit fields and then open the selected one if it wasn't already open
    setConfigItems((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        // If this is the clicked item and it's not already being edited, turn on edit mode
        // Otherwise, turn off edit mode for all items
        isEditing: item.skuGroupId === itemId && !isCurrentlyEditing,
      }))
    );
  };

  // Function to calculate total weightage
  const calculateTotalWeightage = () => {
    return configItems.reduce((total, item) => {
      const weight = parseFloat(item.weightInPercent) || 0;
      return total + weight;
    }, 0);
  };

  // Add this validation function back
  const validateTotalWeightage = () => {
    const total = calculateTotalWeightage();
    if (total > 100) {
      setTotalWeightageError(
        `Total weightage (${total.toFixed(2)}%) exceeds 100%`
      );
      return false;
    } else {
      setTotalWeightageError("");
      return true;
    }
  };

  // Modified update function to clear errors on valid input
  const updateItemValue = (itemId, newValue) => {
    // Clear validation error if a valid number is entered
    if (
      newValue !== "" &&
      /^\d+(\.\d*)?$/.test(newValue) &&
      parseFloat(newValue) > 0
    ) {
      setValidationErrors((prev) => ({
        ...prev,
        [itemId]: "",
      }));
    }

    // Update the value
    setConfigItems((prevItems) =>
      prevItems.map((item) =>
        item.skuGroupId === itemId
          ? { ...item, weightInPercent: newValue }
          : item
      )
    );
  };

  // Add new validation function
  const validateAllFields = () => {
    const newValidationErrors = {};
    let hasErrors = false;

    configItems.forEach((item) => {
      if (!item.weightInPercent || item.weightInPercent === "") {
        newValidationErrors[item.skuGroupId] = "This field cannot be empty";
        hasErrors = true;
      } else if (!/^\d+(\.\d*)?$/.test(item.weightInPercent)) {
        newValidationErrors[item.skuGroupId] = "Please enter numbers only";
        hasErrors = true;
      }
    });

    setValidationErrors(newValidationErrors);
    return !hasErrors;
  };

  // Render a configuration item
  const renderConfigItem = (item) => {
    return (
      <Box key={item.skuGroupId} mt={item.displayOrder === 1 ? "0" : "1rem"}>
        <Box fontSize={"10px"} fontWeight={"400"} color={DARK_PURPLE}>
          {item.skuGroupName.toUpperCase()}
        </Box>

        {/* Show input field when item is in edit mode */}
        {item.isEditing ? (
          <Box>
            <NuralLoginTextField
              value={item.weightInPercent}
              onChange={(e) => updateItemValue(item.skuGroupId, e.target.value)}
              autoFocus={true}
              onBlur={() => toggleEditMode(item.skuGroupId)} // Just toggle edit mode on blur, validation already happened
              type="text"
            />
            {validationErrors[item.skuGroupId] && (
              <Box fontSize={"10px"} color="error.main" mt="4px">
                {validationErrors[item.skuGroupId]}
              </Box>
            )}
          </Box>
        ) : (
          <Box display={"flex"} gap={"2rem"}>
            <Box fontSize={"20px"} fontWeight={"700"} color={DARK_PURPLE}>
              {item.weightInPercent}
            </Box>
            <Box
              padding={"8px"}
              fontSize={"8px"}
              fontWeight={"700"}
              letterSpacing={"4%"}
              color={DARK_PURPLE}
              onClick={() => toggleEditMode(item.skuGroupId)}
              sx={{ cursor: "pointer" }}
            >
              Edit
            </Box>
          </Box>
        )}

        {/* Show weightage type if available */}
        {/* {item.weightageType && (
          <Box
            fontWeight={"700"}
            fontSize={"10px"}
            letterSpacing={"4%"}
            color={DARK_PURPLE}
          >
            {item.weightageType}
          </Box>
        )} */}
      </Box>
    );
  };

  const getRankingWeightage = async () => {
    try {
      setFormLoading(true);

      const resposne = await fetchRankingWeightage();
      if (resposne.statusCode == 200) {
        setConfigItems(resposne.rankingWeightageList);
      } else {
        setStatus(resposne.statusCode);
        setTitle(resposne.statusMessage);
      }
    } catch (error) {
      console.log(error);
      setStatus(error.statusCode);
      setTitle(error.statusMessage);
    } finally {
      setFormLoading(false);
    }
  };

  // Fix the handlePostRequest function to properly handle errors
  const handlePostRequest = async () => {
    setFormLoading(true);
    try {
      setStatus(null);
      setTitle("");

      // Validate all fields first
      if (!validateAllFields()) {
        setFormLoading(false);
        return;
      }

      // Use the validateTotalWeightage function to validate total
      if (!validateTotalWeightage()) {
        setStatus(400);
        setTitle("Total weightage cannot exceed 100%");
        setFormLoading(false);
        return;
      }

      // Prepare updated data from configItems for submission
      const updatedItems = configItems.map((item) => ({
        skuGroupID: item.skuGroupId,
        rankingWeightage: item.weightInPercent.toString(),
        weightageType: "2",
      }));

      // Submit each updated item with better error handling
      for (const item of updatedItems) {
        try {
          const response = await manageRankingWeightage(item);
          if (response.statusCode != 200) {
            setStatus(response.statusCode);
            setTitle(response.statusMessage || "Error updating item");
            return; // Stop if any request fails
          } else {
            setStatus(response.statusCode);
            setTitle(
              response.statusMessage || "Ranking weightage updated successfully"
            );
            setTimeout(() => {
              setStatus(null);
              setTitle("");
            }, 5000);
            getRankingWeightage();
          }
        } catch (itemError) {
          console.error("Error updating item:", itemError);
          setStatus(itemError.statusCode || 500);
          setTitle(
            itemError.statusMessage || `Error updating ${item.skuGroupID}`
          );
          return;
        }
      }

      // Turn off edit mode for all items after successful save
      setConfigItems((prevItems) =>
        prevItems.map((item) => ({
          ...item,
          isEditing: false,
        }))
      );

      // Refresh data after successful update
      await getRankingWeightage();
    } catch (error) {
      console.error("Post request error:", error);
      setStatus(error.statusCode || 500);
      setTitle(error.statusMessage || "Failed to update ranking weightage");
    } finally {
      setFormLoading(false);
    }
  };

  // Fix the handleCancel function to immediately clear status messages
  const handleCancel = () => {
    // Reset validation errors
    setValidationErrors({});
    setTotalWeightageError("");

    // Clear status message immediately
    setStatus(null);
    setTitle("");

    // Refresh the data to return to original state
    getRankingWeightage();
  };

  useEffect(() => {
    getRankingWeightage();
  }, []);

  // Add this to handle auto-dismissing status messages
  useEffect(() => {
    // Auto-dismiss status messages after 5 seconds
    let timer;
    if (status) {
      timer = setTimeout(() => {
        setStatus(null);
        setTitle("");
      }, 5000); // 5 seconds
    }

    // Clear the timer on component unmount or when status changes
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [status]);

  return (
    <Grid container spacing={2} mt={0}>
      <Grid item xs={12} mb={0} ml={0}>
        <BreadcrumbsHeader pageTitle="Attendance" />
      </Grid>

      <Grid item xs={12} ml={0} mt={-2}>
        <TabsBar
          tabs={tabbs}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={12}>
        {formLoading ? (
          <FormSkeleton />
        ) : (
          <Grid2
            items
            mr={3}
            bgcolor={LIGHT_GRAY2}
            padding={"12px 16px"}
            borderRadius={"12px"}
          >
            <Box sx={headTitle}>Weightage Configuration</Box>

            <Grid2 item xs={12} sm={6} md={4}>
              {configItems.map(renderConfigItem)}
            </Grid2>

            {/* Display total weightage error if present */}
            {totalWeightageError && (
              <Box
                fontSize={"12px"}
                color="error.main"
                mt="12px"
                fontWeight="500"
              >
                {totalWeightageError}
              </Box>
            )}
          </Grid2>
        )}
      </Grid>
      {status && (
        <Grid item xs={12} md={12} lg={12} pr={3}>
          <StatusModel
            width={"100%"}
            status={status}
            title={title}
            onClose={() => {
              setStatus(null);
              setTitle("");
            }}
          />
        </Grid>
      )}

      <Grid item xs={12} md={6} lg={6} pr={3}>
        <NuralButton
          text="CANCEL"
          variant="outlined"
          borderColor={PRIMARY_BLUE2}
          onClick={handleCancel}
          width="100%"
        />
      </Grid>
      <Grid item xs={12} md={6} lg={6} pr={3}>
        <NuralButton
          text="SAVE"
          backgroundColor={AQUA}
          variant="contained"
          onClick={handlePostRequest}
          width="100%"
          disabled={formLoading}
        />
      </Grid>
      <Grid item xs={12} mt={1}>
        <Box
          fontSize="12px"
          color={PRIMARY_BLUE2}
          fontStyle="italic"
          fontWeight="700"
          textTransform="uppercase"
        >
          Note: Total percentage cannot exceed more than 100%
        </Box>
      </Grid>
    </Grid>
  );
};
