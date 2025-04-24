import React from "react";
import {
  Grid,
  Typography,
  Box,
  IconButton,
  Button,
  TableCell,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableBody,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import NuralAutocomplete from "../../../../NuralCustomComponents/NuralAutocomplete";
import {
  AQUA,
  AQUA_DARK,
  BLACK,
  BLUE_COLOR,
  DARK_PURPLE,
  LIGHT_GRAY2,
  MEDIUM_BLUE,
  PRIMARY_BLUE2,
} from "../../../../../Common/colors";
import {
  tableHeaderStyle,
  rowstyle,
  headTitle,
  labelStyle
} from "../../../../../Common/commonstyles";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import NuralButton from "../../../../NuralCustomComponents/NuralButton";
import NuralCalendar from "../../../../NuralCustomComponents/NuralCalendar";
import NuralAccordion from "../../../../NuralCustomComponents/NuralAccordion";
import BreadcrumbsHeader from "../../../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../../../Common/TabsBar";
import NuralAccordion2 from "../../../../NuralCustomComponents/NuralAccordion2";
import NuralTextField from "../../../../NuralCustomComponents/NuralTextField";
import NuralTextButton from "../../../../NuralCustomComponents/NuralTextButton";
import NuralRadioButton from "../../../../NuralCustomComponents/NuralRadioButton";
import NuralUploadFormat from "../../../../NuralCustomComponents/NuralUploadFormat";
import NuralFileUpload from "../../../../NuralCustomComponents/NuralFileUpload";
import NuralUploadStatus from "../../../../NuralCustomComponents/NuralUploadStatus";


 

const ADDTask = () => {
   const [page, setPage] = React.useState(0);
  const [saveClicked, setSaveClicked] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [showStatus, setShowStatus] = React.useState(false);
  const templates = [
    {
      name: "Template 1",
      onView: () => console.log("View Template 1"),
      onDownload: () => console.log("Download Template 1"),
    },
    {
      name: "Template 2",
      onView: () => console.log("View Template 2"),
      onDownload: () => console.log("Download Template 2"),
    },
    {
      name: "Template 3",
      onView: () => console.log("View Template 3"),
      onDownload: () => console.log("Download Template 3"),
    },
    {
      name: "Template 4",
      onView: () => console.log("View Template 4"),
      onDownload: () => console.log("Download Template 4"),
    },
  ];
 


  const options = [
    "Nural Network",
    "Deep Learning",
    "Machine Learning",
    "Artificial Intelligence",
    "Computer Vision",
  ];
  const [activeTab, setActiveTab] = React.useState("task-search");
  const navigate = useNavigate();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleTabChange = (newValue) => {
    setActiveTab(newValue);
    navigate(`/${newValue}`);
  };
  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });
  const images = ["Image 1", "Image 2", "Image 3", "Image 4"];
  const generateDummyData = () => {
    const statuses = ["Pending", "Approved", "Rejected"];
    const requestTypes = ["Finance Block", "Theft Block", "Customer Request"];
    const userNames = ["John D.", "Sarah M.", "Mike R.", "Emma S.", "Alex P."];

    return Array(2)
      .fill()
      .map((_, index) => ({
        id: `${1000 + index}`,
        serialNumber: `IMEI${Math.floor(Math.random() * 1000000000)}`,
        serialNumber2: `SN${Math.floor(Math.random() * 100000)}`,
        skuCode: `SKU${Math.floor(Math.random() * 10000)}`,
        skuName: `Product ${Math.floor(Math.random() * 100)}`,
        userName: userNames[Math.floor(Math.random() * userNames.length)],
        requestType:
          requestTypes[Math.floor(Math.random() * requestTypes.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        requestDate: new Date(
          2024,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1
        ).toLocaleDateString(),
      }));
  };

  const handleSaveToggle = () => {
    setSaveClicked((prev) => !prev);
  };

  const [rows, setRows] = React.useState(generateDummyData());
  const [filteredRows, setFilteredRows] = React.useState(rows);
  const handleSort = (columnName) => {
    let direction = "asc";

    // If clicking the same column
    if (sortConfig.key === columnName) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else {
        // Reset sorting if already in desc order
        setSortConfig({ key: null, direction: null });
        setFilteredRows([...rows]); // Reset to original order
        return;
      }
    }
    setSortConfig({ key: columnName, direction });
  };
  return (
    <Grid marginTop={2} xs={12}>
      <NuralAccordion2 title="ADD" backgroundColor={"white"} padding={"0px"}>
        {saveClicked && (
          <>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <NuralFileUpload2 backgroundColor={LIGHT_GRAY2} />
              </Grid>
              <Grid item xs={6}>
                <NuralUploadFormat title="Upload Format" />
              </Grid>
            </Grid>
            <Grid container spacing={2} marginTop={1}>
              <Grid item xs={6}>
                <NuralAccordion
                  titleColor={DARK_PURPLE}
                  buttonColor={PRIMARY_BLUE2}
                  buttonBg={MEDIUM_BLUE}
                  backgroundColor={LIGHT_GRAY2}
                  width="100%"
                  referenceIcon1={"./Icons/downloadIcon.svg"}
                  referenceIcon2={"./Icons/downloadIcon.svg"}
                  title="Templates"
                  templates={templates}
                  buttons={true}
                />
              </Grid>
              <Grid item xs={6}>
                <NuralUploadStatus
                  status="success"
                  title="Upload Success"
                  actionText="VIEW FILE"
                  onAction={() => console.log("View clicked")}
                  width="100%"
                />
                <Grid container spacing={2} mt={2}>
                  <Grid item xs={6}>
                    <NuralButton
                      text="CANCEL"
                      variant="outlined"
                      color={PRIMARY_BLUE2}
                      fontSize="12px"
                      height="36px"
                      borderColor={PRIMARY_BLUE2}
                      width="100%"
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <NuralButton
                      text="SAVE"
                      variant="outlined"
                      backgroundColor={AQUA}
                      color={PRIMARY_BLUE2}
                      fontSize="12px"
                      height="36px"
                      borderColor={BLUE_COLOR}
                      width="100%"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </>
        )}
        {!saveClicked && (
          <Grid
            xs={12}
            borderRadius={2}
            padding={2}
            backgroundColor={LIGHT_GRAY2}
          >
            {/* First Row - 3 NuralAutocomplete */}
            <Typography sx={headTitle}>Add Task</Typography>

            <Grid item xs={12} md={6} lg={6} mb={2}>
              <Typography
                variant="h6"
                sx={{
                  color: DARK_PURPLE,
                  fontFamily: "Manrope",
                  fontWeight: 400,
                  fontSize: "10px",
                  lineHeight: "13.66px",
                  letterSpacing: "4%",
                  mb: 1,
                }}
              >
                SELECT MODE
              </Typography>
              <NuralRadioButton
                // onChange={handleFormatChange}
                options={[
                  { value: "interface", label: "Interface" },
                  { value: "batch", label: "Batch" },
                ]}
                // value={selectedFormat}
                width="100%"
                gap="15px"
                marginLeft="-15px"
              />
            </Grid>

            <Grid
              container
              spacing={2}
              mb={2}
              sx={{
                gap: { xs: 0, sm: 0, md: 0 },
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Grid item xs={12} sm={4} md={4}>
                <Typography sx={labelStyle}>Task Type</Typography>
                <NuralAutocomplete
                  label="SKU"
                  options={options}
                  placeholder="SELECT"
                  width="100%"
                />
              </Grid>
              <Grid item xs={12} sm={4} md={4}>
                <Typography variant="body1" sx={labelStyle}>
                  Task Type
                </Typography>
                <NuralAutocomplete
                  label="SKU"
                  options={options}
                  placeholder="SELECT"
                  width="100%"
                />
              </Grid>
              <Grid item xs={12} sm={4} md={4}>
                <Typography sx={labelStyle}>Task Type</Typography>
                <NuralAutocomplete
                  label="SKU"
                  options={options}
                  placeholder="SELECT"
                  width="100%"
                />
              </Grid>
              <Grid item xs={12} sm={4} md={4}>
                <Typography sx={labelStyle}>Description</Typography>
                <NuralTextField placeholder="xxxxxxxxxxxxx" width="100%" />
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <Typography sx={labelStyle}>Due DATE</Typography>
                <NuralCalendar width="100%" placeholder="DD/MMM/YYYY" />
              </Grid>
              <Grid item xs={12} sm={4} md={4}>
                <Typography sx={labelStyle}>Need To Verify</Typography>
                <NuralAutocomplete
                  label="SKU"
                  options={options}
                  placeholder="SELECT"
                  width="100%"
                />
              </Grid>
            </Grid>
            <Grid
              container
              spacing={2}
              mb={2}
              mt={2}
              sx={{
                gap: { xs: 0, sm: 0, md: 0 },
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <NuralButton
                  text="CANCEL"
                  variant="outlined"
                  color={PRIMARY_BLUE2}
                  fontSize="12px"
                  height="36px"
                  borderColor={PRIMARY_BLUE2}
                  // onClick={() => {
                  //   handleCancel();
                  //   setShowStatus(false);
                  // }}
                  width="100%"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <NuralButton
                  text="SAVE"
                  variant="outlined"
                  backgroundColor={AQUA}
                  color={PRIMARY_BLUE2}
                  fontSize="12px"
                  height="36px"
                  borderColor={BLUE_COLOR}
                  onClick={handleSaveToggle}
                  // onClick={() => {
                  //   handleCancel();
                  //   setShowStatus(false);
                  // }}
                  width="100%"
                />
              </Grid>
            </Grid>
          </Grid>
        )}
      </NuralAccordion2>
    </Grid>
  );
};

export default ADDTask; 