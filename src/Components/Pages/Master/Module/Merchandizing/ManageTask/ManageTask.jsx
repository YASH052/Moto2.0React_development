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
import { tableHeaderStyle, rowstyle } from "../../../../../Common/commonstyles";
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
// Import the new components
import AddTask from "./AddTask";
import ViewTask from "./ViewTask";
import UpdateTask from "./UpdateTask";

const ManageTask = () => {
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
  const labelStyle = {
    fontSize: "10px",
    lineHeight: "13.66px",
    letterSpacing: "4%",
    color: DARK_PURPLE,
    marginBottom: "5px",
    fontWeight: 400,
  };

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

    return Array(25)
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
    let sortedRows = [...filteredRows];

    if (sortConfig.key === columnName && sortConfig.direction === "asc") {
      direction = "desc";
    }

    sortedRows.sort((a, b) => {
      const keys = [
        "serialNumber",
        "serialNumber2",
        "skuCode",
        "skuName",
        "userName",
        "requestType",
        "status",
        "requestDate",
      ];
      const keyIndex = parseInt(columnName.replace("column", ""), 10) - 1;
      const key = keys[keyIndex];

      if (!key || !a.hasOwnProperty(key) || !b.hasOwnProperty(key)) return 0;

      const valA = a[key];
      const valB = b[key];

      if (valA < valB) {
        return direction === "asc" ? -1 : 1;
      }
      if (valA > valB) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    if (sortConfig.key === columnName && sortConfig.direction === "desc") {
      setSortConfig({ key: null, direction: null });
      setFilteredRows([...rows]);
    } else {
      setSortConfig({ key: columnName, direction });
      setFilteredRows(sortedRows);
    }
  };

  return (
    <Grid container spacing={2} sx={{ position: "relative" }}>
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
        <Box mt={0} mb={0} ml={1}>
          <BreadcrumbsHeader pageTitle="MERCHANDIZING" />
        </Box>
      </Grid>
      <Grid container spacing={0} ml={2} pr={2}>
        <Grid marginTop={2} xs={12}>
          <NuralAccordion2 title="ADD" padding={"0px"}>
            <AddTask
              saveClicked={saveClicked}
              templates={templates}
              labelStyle={labelStyle}
              options={options}
            />
          </NuralAccordion2>
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
                onClick={handleSaveToggle}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid marginTop={2} xs={12}>
          <NuralAccordion2
            title="VIEW"
            
            padding={"0px"}
          >
            <ViewTask
              labelStyle={labelStyle}
              options={options}
              filteredRows={filteredRows}
              page={page}
              rowsPerPage={rowsPerPage}
              handleSort={handleSort}
              sortConfig={sortConfig}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              setPage={setPage}
            />
          </NuralAccordion2>
        </Grid>
        <Grid marginTop={2} xs={12}>
          <NuralAccordion2 title="UPDATE TASK" >
            <UpdateTask
              labelStyle={labelStyle}
              options={options}
              filteredRows={filteredRows}
              page={page}
              rowsPerPage={rowsPerPage}
              handleSort={handleSort}
              sortConfig={sortConfig}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              setPage={setPage}
              images={images}
            />
          </NuralAccordion2>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ManageTask;
