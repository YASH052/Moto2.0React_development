import { Box, Grid, Grid2 } from "@mui/material";
import React, { useEffect, useState } from "react";
import BreadcrumbsHeader from "../../../../Common/BreadcrumbsHeader";
import { useNavigate } from "react-router-dom";
import TabsBar from "../../../../Common/TabsBar";
import {
  AQUA,
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE,
  PRIMARY_BLUE2,
} from "../../../../Common/colors";
import NuralLoginTextField from "../../../NuralCustomComponents/NuralLoginTextField";
import NuralButton from "../../../NuralCustomComponents/NuralButton";
import {
  fetchRankingWeightage,
  GetRIScoreWeightageListMoto,
  manageRankingWeightage,
  SaveRIScoreWeightageMoto,
} from "../../../../Api/Api";
import StatusModel from "../../../../Common/StatusModel";
import { FormSkeleton } from "../../../../Common/Skeletons";

export const RIAuditUpdate = () => {
  const [activeTab, setActiveTab] = React.useState("ri-weightage");
  const navigate = useNavigate();
  const [tabbs, setTabbs] = React.useState([
    { label: "Demo Planogram", value: "demo-planogram" },
    { label: "Manage Audit", value: "manage" },
    { label: "L1/L2 Issue", value: "create-salesman" },
    { label: "RI Weightage", value: "ri-weightage" },
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
    const item = configItems.find(
      (item) => item.riScoreWeightageConfigId === itemId
    );
    const isCurrentlyEditing = item?.isEditing || false;

    // Close all edit fields and then open the selected one if it wasn't already open
    setConfigItems((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        // If this is the clicked item and it's not already being edited, turn on edit mode
        // Otherwise, turn off edit mode for all items
        isEditing:
          item.riScoreWeightageConfigId === itemId && !isCurrentlyEditing,
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

  // Modified update function with immediate validation
  const updateItemValue = (itemId, newValue) => {
    // Only allow numeric input
    if (newValue !== "" && !/^\d+(\.\d*)?$/.test(newValue)) {
      setValidationErrors({
        ...validationErrors,
        [itemId]: "Please enter numbers only",
      });
      return;
    }

    // Clear field-specific error
    setValidationErrors({
      ...validationErrors,
      [itemId]: "",
    });

    // Create updated items to calculate the new total
    const updatedItems = configItems.map((item) =>
      item.riScoreWeightageConfigId === itemId
        ? { ...item, weightInPercent: newValue }
        : item
    );

    // Calculate new total immediately
    const newTotal = updatedItems.reduce((total, item) => {
      const weight = parseFloat(item.weightInPercent) || 0;
      return total + weight;
    }, 0);

    // Validate total immediately
    if (newTotal > 100) {
      setTotalWeightageError(
        `Total weightage (${newTotal.toFixed(2)}%) exceeds 100%`
      );
    } else if (newTotal < 100) {
      setTotalWeightageError(
        `Total weightage (${(100 - newTotal).toFixed(2)}%) Less than 100%`
      );
    } else {
      setTotalWeightageError("");
    }

    // Update state with new items
    setConfigItems(updatedItems);
  };

  // Render a configuration item
  const renderConfigItem = (item) => {
    return (
      <Box
        key={item.riScoreWeightageConfigId}
        mt={item.displayOrder === 1 ? "0" : "1rem"}
      >
        <Box fontSize={"10px"} fontWeight={"400"} color={DARK_PURPLE}>
          {item.riScoreWeightageName.toUpperCase()} %
        </Box>

        {/* Show input field when item is in edit mode */}
        {item.isEditing ? (
          <Box>
            <NuralLoginTextField
              value={item.weightInPercent}
              onChange={(e) =>
                updateItemValue(item.riScoreWeightageConfigId, e.target.value)
              }
              autoFocus={true}
              onBlur={() => toggleEditMode(item.riScoreWeightageConfigId)} // Just toggle edit mode on blur, validation already happened
              type="text"
            />
            {validationErrors[item.riScoreWeightageConfigId] && (
              <Box fontSize={"10px"} color="error.main" mt="4px">
                {
                  validationErrors[
                    item.riScoreWeightageConfigIdriScoreWeightageConfigId
                  ]
                }
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
              onClick={() => toggleEditMode(item.riScoreWeightageConfigId)}
              sx={{ cursor: "pointer" }}
            >
              EDIT
            </Box>
          </Box>
        )}
      </Box>
    );
  };

  const getRankingWeightage = async () => {
    try {
      setFormLoading(true);

      const resposne = await GetRIScoreWeightageListMoto();
      if (resposne.statusCode == 200) {
        setConfigItems(resposne.riScoreWeightageList);
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
    try {
      setStatus(null);
      setTitle("");

      // Validate input fields
      const hasFieldErrors = Object.values(validationErrors).some(
        (error) => error !== ""
      );
      if (hasFieldErrors) {
        setStatus(400);
        setTitle("Please correct the errors in the form");
        return;
      }

      // Use the validateTotalWeightage function to validate total
      if (!validateTotalWeightage()) {
        setStatus(400);
        setTitle("Total weightage cannot exceed 100%");
        return;
      }

      // Find the item currently being edited
      const editedItem = configItems.find((item) => item.isEditing);

      if (!editedItem) {
        // Handle the case where no item is actively being edited, though UI flow might prevent this
        console.warn("Save clicked but no item is in edit mode.");
        // Optionally set a status/title or just return
        // setStatus(400);
        // setTitle("No item selected for editing.");
        return;
      }
      console.log(!editedItem, "editeitem");
      console.log("editeitem", editedItem);
      // Prepare the body with the dynamic data from the edited item
      let body = {
        riScoreWeightageConfigId: editedItem.riScoreWeightageConfigId,
        rankingWeightage: editedItem.weightInPercent || "0", // Use edited value, default to "0" if empty
      };

      // Submit the updated item
      try {
        const response = await SaveRIScoreWeightageMoto(body);
        if (response.statusCode != 200) {
          setStatus(response.statusCode);
          setTitle(response.statusMessage || "Error updating item");
          // Keep the item in edit mode on failure? Or cancel edit? Currently does nothing.
        } else {
          setStatus(200);
          setTitle(response.statusMessage || "Error updating item");
          console.log("uploaded data sucss", response.statusMessage);
          // Turn off edit mode for all items after successful save
          setConfigItems((prevItems) =>
            prevItems.map((item) => ({
              ...item,
              isEditing: false,
            }))
          );

          // Refresh data after successful update
          await getRankingWeightage(); // Refresh list to show saved value and turn off edit mode visually
        }
      } catch (itemError) {
        console.error("Error updating item:", itemError);
        setStatus(itemError.statusCode || 500);
        setTitle(
          itemError.statusMessage ||
            `Error updating ${editedItem.riScoreWeightageName}`
        );
        // Keep the item in edit mode on failure
      }
    } catch (error) {
      console.error("Post request error:", error);
      setStatus(error.statusCode || 500);
      setTitle(error.statusMessage || "Failed to update ranking weightage");
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

    // Turn off edit mode for all items on cancel
    setConfigItems((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        isEditing: false,
      }))
    );

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
    <Box py={"1rem"} paddingLeft={".5rem"}>
      <Box
      //  border={"1px solid red"}
      >
        <BreadcrumbsHeader pageTitle={"Brand  "} />
      </Box>
      <Grid
        item
        xs={12}
        md={6}
        lg={12}
        sx={{
          // position: "sticky",
          top: 0,
          // ml: 1,
        }}
      >
        <Grid ml={"-1rem"}>
          <TabsBar
            tabs={tabbs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </Grid>
        {formLoading ? (
          <FormSkeleton />
        ) : (
          <Grid2
            bgcolor={LIGHT_GRAY2}
            // padding={"12px"}
            // marginTop={"1rem"}
            borderRadius={"12px"}
            p={"1rem"}
            // sx={{
            //   marginTop: "12px",
            // }}
          >
            <Box
              fontWeight={"700"}
              fontSize={"14px"}
              pb={"1rem"}
              color={PRIMARY_BLUE}
            >
              RI Score Weightage Configuration
            </Box>

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
      <Grid container spacing={1} mt={"1rem"}>
        <Grid
          container
          spacing={1}
          sx={{
            ml: "12px",
          }}
        >
          {status && (
            <StatusModel
              width={"100%"}
              status={status}
              title={title}
              onClose={() => {
                setStatus(null);
                setTitle("");
              }}
            />
          )}
        </Grid>
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
            text="SAVE"
            backgroundColor={AQUA}
            variant="contained"
            onClick={handlePostRequest}
            width="100%"
            disabled={formLoading || calculateTotalWeightage() !== 100}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
