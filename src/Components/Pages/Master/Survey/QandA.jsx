import React, { useState } from "react";
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
  MenuItem,
  Select,
  InputBase,
  AccordionDetails,
  Accordion,
  AccordionSummary,
  FormControlLabel,
  Switch,
  FormControl,
  FormGroup,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import { useNavigate } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import {
  AQUA,
  AQUA_DARK,
  BLACK,
  BLUE_COLOR,
  DARK_PURPLE,
  LIGHT_GRAY2,
  MEDIUM_BLUE,
  PRIMARY_BLUE2,
} from "../../../Common/colors";
import { tableHeaderStyle, rowstyle } from "../../../Common/commonstyles";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import NuralCalendar from "../../NuralCustomComponents/NuralCalendar";
import NuralAccordion from "../../NuralCustomComponents/NuralAccordion";
import BreadcrumbsHeader from "../../../Common/BreadcrumbsHeader";
import TabsBar from "../../../Common/TabsBar";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import NuralTextField from "../../NuralCustomComponents/NuralTextField";
import NuralTextButton from "../../NuralCustomComponents/NuralTextButton";
import NuralRadioButton from "../../NuralCustomComponents/NuralRadioButton";
import NuralUploadFormat from "../../NuralCustomComponents/NuralUploadFormat";
import NuralFileUpload from "../../NuralCustomComponents/NuralFileUpload";
import NuralUploadStatus from "../../NuralCustomComponents/NuralUploadStatus";
import { AddIcCallOutlined, Image } from "@mui/icons-material";
import SelectionPanel from "../../NuralCustomComponents/SelectionPanel";
import SelectionCheckboxItem from "../../NuralCustomComponents/SelectionCheckboxItem";
import { Stack, styled } from "@mui/system";
import ISPZeroSaleTable from "../../Dashboard/ISPZeroSaleTable";


const QandA = () => {
  const [page, setPage] = React.useState(0);
  const [saveClicked, setSaveClicked] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [showStatus, setShowStatus] = React.useState(false);
  const [selected, setSelected] = React.useState("");
  const views = ["Role 1", "Role 2", "Role 3", "Role 4"];
  const [options2, setOptions2] = useState([
    { id: 1, value: "", isCorrect: false },
    { id: 2, value: "", isCorrect: false },
    { id: 3, value: "", isCorrect: false },
  ]);

  const handleAddOption = () => {
    const newOption = {
      id: options2.length + 1,
      value: "",
      isCorrect: false,
    };
    setOptions2([...options2, newOption]);
  };

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

  const navigate = useNavigate();

  const StyledInput = styled(InputBase)(({ theme }) => ({
    marginLeft: "25px",
    border: "1px solid #a1b0e5",
    marginTop: "10px",
    borderRadius: "8px",
    maxHeight: "40px",
    padding: "4px 12px",
    fontSize: "14px",
    width: "60px",
    textAlign: "center",
    backgroundColor: "#eef1fc",
    color: "#5f74be",
  }));

  const StyledSelect = styled(Select)(({ theme }) => ({
    border: "1px solid #a1b0e5",
    marginTop: "10px",
    maxHeight: "40px",
    borderRadius: "8px",
    paddingLeft: "12px",
    fontSize: "14px",
    backgroundColor: "#eef1fc",
    color: "#5f74be",
    ".MuiSelect-icon": {
      color: "#5f74be",
    },
  }));

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleDateSelect = (date) => {
    console.log("Selected Date:", date);
    // You can store it in state if needed
    // setSelectedDate(date);
  };

  const handleMonthChange = (month) => {
    console.log("Changed Month:", month);
    // You can update state if needed
    // setCurrentMonth(month);
  };

  const handleYearChange = (year) => {
    console.log("Changed Year:", year);
    // You can update state if needed
    // setCurrentYear(year);
  };

  const handleNavigate = ({ month, year }) => {
    console.log("Navigated to:", month, year);
    // Useful if you want to do something when the calendar is navigated
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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [checked, setChecked] = useState(true);
  const [questionType, setQuestionType] = React.useState("MCQ");
  const [questionType1, setQuestionType1] = React.useState("RANGE");
  const [multiple, setMultiple] = React.useState(true);
  const [addOthers, setAddOthers] = React.useState(true);
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
  const [values, setValues] = useState([0, 0]);

  const handleChange = (index, delta) => {
    setValues((prev) =>
      prev.map((val, i) => (i === index ? Math.max(0, val + delta) : val))
    );
  };

  return (
    <Grid marginTop={2} xs={12}>
      <NuralAccordion2
        title="Questions & Answers"
        backgroundColor={"white"}
        padding={"0px"}
      >
        <Grid
          item
          spacing={2}
          marginTop={2}
          direction="column"
          xl={12}
          lg={12}
          md={12}
          borderRadius={4}
        >
          <Grid>
            <Accordion
              sx={{
                backgroundColor: LIGHT_GRAY2,
                borderRadius: 4,
                boxShadow: "none",
                "&::before": { display: "none" }, // removes divider line
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: PRIMARY_BLUE2 }} />}
                sx={{
                  padding: 1,
                  backgroundColor: "white", // ya koi bhi required color
                  "& .MuiAccordionSummary-content": {
                    margin: 0,
                  },
                  "& .MuiAccordionSummary-expandIconWrapper": {
                    outline: "none",
                  },
                  "&:focus": {
                    outline: "none",
                  },
                  "& .MuiSvgIcon-root:focus": {
                    outline: "none",
                  },
                }}
              >
                <Typography
                  sx={{
                    color: PRIMARY_BLUE2,
                    fontFamily: "Manrope",
                    fontWeight: 700,
                    fontSize: "14px",
                    lineHeight: "19.12px",
                  }}
                >
                  Q2- Descriptive-short/long
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ px: 2 }}>
                <Grid item xs={12} sm={12} md={12} marginTop={2}>
                  <Typography
                    variant="body1"
                    sx={{
                      ...labelStyle,
                      fontSize: { xs: "12px", sm: "10px" },
                    }}
                    fontWeight={600}
                  >
                    ADD QUESTION
                  </Typography>

                  <Box display="flex" alignItems="center" gap={2}>
                    <NuralTextField placeholder="xxxxxxxxxxxxx" width="100%" />

                    <img
                      src="/Icons/uploadicon2.svg"
                      alt="Clear"
                      style={{
                        cursor: "pointer",
                        width: 200,
                        height: 40,
                        paddingRight: 15,
                      }}
                    />
                    <img
                      src="/Icons/crossicon.svg"
                      alt="Clear"
                      style={{
                        cursor: "pointer",
                        width: 22,
                        paddingRight: 15,
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={12} md={12} marginTop={2}>
                  <Typography
                    variant="body1"
                    sx={{
                      ...labelStyle,
                      fontSize: { xs: "12px", sm: "10px" },
                    }}
                    fontWeight={600}
                  >
                    ADD Description (optional)
                  </Typography>

                  <Box display="flex" alignItems="center" gap={2}>
                    <NuralTextField placeholder="xxxxxxxxxxxxx" width="100%" />
                    <img
                      src="/Icons/crossicon.svg"
                      alt="Clear"
                      style={{
                        cursor: "pointer",
                        width: 22,
                        paddingRight: 15,
                      }}
                    />
                  </Box>
                </Grid>

                {options2.map((option, index) => (
                  <Grid
                    key={option.id}
                    backgroundColor={MEDIUM_BLUE}
                    padding={1}
                    borderRadius={4}
                    marginTop={2}
                  >
                    <Box display="flex" alignItems="center" gap={2} mt={2}>
                      <NuralTextField
                        placeholder={`Option ${index + 1}`}
                        width="100%"
                        value={option.value}
                        onChange={(e) => {
                          const updated = [...options2];
                          updated[index].value = e.target.value;
                          setOptions2(updated);
                        }}
                      />
                      <img
                        src="/Icons/uploadicon2.svg"
                        alt="Upload"
                        style={{
                          cursor: "pointer",
                          width: 200,
                          height: 40,
                          paddingRight: 15,
                        }}
                      />
                      <img
                        src="/Icons/crossicon.svg"
                        alt="Clear"
                        style={{
                          cursor: "pointer",
                          width: 22,
                          paddingRight: 15,
                        }}
                        onClick={() => {
                          const updated = options2.filter(
                            (_, i) => i !== index
                          );
                          setOptions2(updated);
                        }}
                      />
                    </Box>

                    <Grid
                      container
                      justifyContent="flex-end"
                      alignItems="center"
                      marginTop={2}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <img
                          src="/Icons/duplicateicon.svg"
                          alt="Duplicate"
                          style={{
                            cursor: "pointer",
                            width: 150,
                            marginTop: "2px",
                            paddingRight: 15,
                          }}
                          onClick={() => {
                            const duplicated = {
                              ...option,
                              id: options2.length + 1,
                            };
                            setOptions2([...options2, duplicated]);
                          }}
                        />
                        <img
                          src="/Icons/deleteicon.svg"
                          alt="Delete"
                          style={{
                            cursor: "pointer",
                            width: 150,
                            marginTop: "2px",
                            paddingRight: 15,
                          }}
                          onClick={() => {
                            const updated = options2.filter(
                              (_, i) => i !== index
                            );
                            setOptions2(updated);
                          }}
                        />
                      </Box>

                      <Box
                        sx={{
                          backgroundColor: "#e8edfb",
                          borderRadius: "20px",
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "4px 10px",
                        }}
                      >
                        <FormControlLabel
                          control={
                            <Switch
                              checked={option.isCorrect}
                              onChange={() => {
                                const updated = [...options2];
                                updated[index].isCorrect =
                                  !updated[index].isCorrect;
                                setOptions2(updated);
                              }}
                              size="small"
                              sx={{
                                "& .MuiSwitch-switchBase.Mui-checked": {
                                  color: "#2f3ea8",
                                },
                                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                                  {
                                    backgroundColor: "#2f3ea8",
                                  },
                              }}
                            />
                          }
                          label="MARK AS CORRECT"
                          sx={{
                            ".MuiFormControlLabel-label": {
                              fontSize: "12px",
                              fontWeight: 500,
                              color: "#1a1a40",
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                  </Grid>
                ))}

                <Grid container justifyContent="flex-end" padding={3}>
                  <Grid item xs={12} sm={6} md={3} lg={2}>
                    <NuralButton
                      text="ADD OPTION +"
                      variant="outlined"
                      color={PRIMARY_BLUE2}
                      fontSize="16px"
                      height="42px"
                      borderColor={PRIMARY_BLUE2}
                      width="100%"
                      onClick={handleAddOption}
                    />
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>
      </NuralAccordion2>
    </Grid>
  );
};

export default QandA;
