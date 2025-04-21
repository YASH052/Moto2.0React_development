import { Grid, Typography, FormHelperText } from "@mui/material";
import React, { useEffect } from "react";
import NuralAccordion2 from "../../NuralCustomComponents/NuralAccordion2";
import {
  DARK_PURPLE,
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
} from "../../../Common/colors";
import NuralAutocomplete from "../../NuralCustomComponents/NuralAutocomplete";
import NuralButton from "../../NuralCustomComponents/NuralButton";
import NuralTextButton from "../../NuralCustomComponents/NuralTextButton";
import { IssueTable, IssueCategoryTable } from "./TableComponents";
import {
  getIssueCategoryDropdown,
  getIssueCategoryList,
  GetIssueMasterList,
} from "../../../Api/Api";
import { FormSkeleton } from "../../../Common/Skeletons";
import StatusModel from "../../../Common/StatusModel";

const View = () => {
  const [accordionExpanded, setAccordionExpanded] = React.useState(true);
  const [issueCategoryDrop, setIssueCategoryDrop] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [showStatus, setShowStatus] = React.useState(false);
  const [status, setStatus] = React.useState("");
  const [message, setMessage] = React.useState("");

  const [flag, setFlag] = React.useState(false);
  const [flag2, setFlag2] = React.useState(false);
  const [selectedType, setSelectedType] = React.useState("ISSUE CATEGORY");
  const [issueCatPage, setIssueCatPage] = React.useState(0);
  const [issueCatPageSize, setIssueCatPageSize] = React.useState(10);
  const [issuePage, setIssuePage] = React.useState(0);
  const [issuePageSize, setIssuePageSize] = React.useState(10);
  const [totalIssueRecords, setTotalIssueRecords] = React.useState(0);
  const [totalIssueCatRecords, setTotalIssueCatRecords] = React.useState(0);
  const [issueListDropDown, setIssueListDropDown] = React.useState([]);
  const [tableLoading, setTableLoading] = React.useState(false);

  const [issueCatSearchParams, setIssueCatSearchParams] = React.useState({
    issueCategoryID: 0,
    pageSize: issueCatPageSize,
    pageIndex: issueCatPage + 1,
  });

  const [issueSearchParams, setIssueSearchParams] = React.useState({
    issuesCategoryID: 0,
    issueMasterID: 0,
    pageSize: issuePageSize,
    pageIndex: issuePage + 1,
    CallType: 1,
  });

  // Separate rows for each type
  const [issueCategoryRows, setIssueCategoryRows] = React.useState([]);
  const [issueRows, setIssueRows] = React.useState([]);

  const labelStyle = {
    fontSize: "10px",
    lineHeight: "13.66px",
    letterSpacing: "4%",
    color: DARK_PURPLE,
    marginBottom: "5px",
    fontWeight: 400,
  };

  const [errors, setErrors] = React.useState({
    issueCategoryId: "",
  });

  const [sortConfig, setSortConfig] = React.useState({
    key: null,
    direction: null,
  });

  const handleSort = (columnName) => {
    let direction = "asc";
    if (sortConfig.key === columnName) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else if (sortConfig.direction === "desc") {
        // Reset sort when clicking the same column for the third time
        setSortConfig({ key: null, direction: null });
        return;
      }
    }
    setSortConfig({ key: columnName, direction });
  };

  // Add useEffect to watch for sortConfig changes
  useEffect(() => {
    if (sortConfig.key) {
      if (selectedType === "ISSUE") {
        setFlag2(prev => !prev);
      } else {
        setFlag(prev => !prev);
      }
    }
  }, [sortConfig, selectedType]);

  const handleToggleChange = (id) => {
    if (selectedType === "ISSUE") {
      setIssueRows((prevRows) =>
        prevRows.map((row) =>
          row.id === id ? { ...row, status: !row.status } : row
        )
      );
    } else {
      setIssueCategoryRows((prevRows) =>
        prevRows.map((row) =>
          row.id === id ? { ...row, status: !row.status } : row
        )
      );
    }
  };

  const handlePageChange = (newPage) => {
    if (selectedType === "ISSUE") {
      setIssuePage(newPage);
      setIssueSearchParams(prev => ({
        ...prev,
        pageIndex: newPage + 1,
      }));
      setFlag2(!flag2);
    } else {
      setIssueCatPage(newPage);
      setIssueCatSearchParams(prev => ({
        ...prev,
        pageIndex: newPage + 1,
      }));
      setFlag(!flag);
    }
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    if (selectedType === "ISSUE") {
      setIssuePageSize(newRowsPerPage);
      setIssuePage(0);
      setIssueSearchParams(prev => ({
        ...prev,
        pageSize: newRowsPerPage,
        pageIndex: 1,
      }));
      setFlag2(!flag2);
    } else {
      setIssueCatPageSize(newRowsPerPage);
      setIssueCatPage(0);
      setIssueCatSearchParams(prev => ({
        ...prev,
        pageSize: newRowsPerPage,
        pageIndex: 1,
      }));
      setFlag(!flag);
    }
  };

  const currentRows = selectedType === "ISSUE" ? issueRows : issueCategoryRows;

  useEffect(() => {
    fetchIssueCatList();
    fetchIssueList();
    fetchIssueListDropDown();
  }, []);

  useEffect(() => {
    fetchIssueCatList();
  }, [flag]);

  useEffect(() => {
    fetchIssueList();
  }, [flag2]);

  const fetchIssueListDropDown = async () => {
    try {
      let res = await GetIssueMasterList(issueSearchParams);
      if (res.statusCode == 200) {
        setIssueListDropDown(res.issueMasterList);
      } else {
        setIssueListDropDown([]);
      }
    } catch (error) {
      console.error("Error in fetchIssueList:", error);
      setIssueRows([]);
      setTotalIssueRecords(0);
    }
  };

  const fetchIssueList = async () => {
    setTableLoading(true);
    try {
      let res = await GetIssueMasterList(issueSearchParams);
      if (res.statusCode == 200) {
        let sortedRows = res.issueMasterList.map((item) => ({
          id: item.issueMasterID,
          name: item.issue,
          code: item.issue,
          category: item.issueCategoryName,
          status: item.status === 1,
        }));

        // Apply sorting if sortConfig is set
        if (sortConfig.key) {
          sortedRows.sort((a, b) => {
            if (sortConfig.key === 'status') {
              return sortConfig.direction === 'asc' 
                ? (a.status ? 1 : -1) - (b.status ? 1 : -1)
                : (b.status ? 1 : -1) - (a.status ? 1 : -1);
            }
            const aValue = a[sortConfig.key]?.toString().toLowerCase() || '';
            const bValue = b[sortConfig.key]?.toString().toLowerCase() || '';
            return sortConfig.direction === 'asc'
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
          });
        }

        setIssueRows(sortedRows);
        setTotalIssueRecords(res.totalRecords);
      } else {
        setIssueRows([]);
        setTotalIssueRecords(0);
        setStatus(500);
        setMessage(res.message || "Internal Server Error");
        setShowStatus(true);
      }
    } catch (error) {
      console.error("Error in fetchIssueList:", error);
      setIssueRows([]);
      setTotalIssueRecords(0);
      setStatus(500);
      setMessage("Internal Server Error");
      setShowStatus(true);
    } finally {
      setTableLoading(false);
    }
  };

  const fetchIssueCatList = async () => {
    setTableLoading(true);
    let body = {
      issueCategoryID: issueCatSearchParams.issueCategoryID,
      pageSize: issueCatPageSize,
      pageIndex: issueCatPage + 1,
    };
    try {
      let res = await getIssueCategoryList(body);
      if (res.statusCode == 200) {
        let sortedRows = res.issueCategoryList.map((item) => ({
          id: item.issueCategoryID,
          name: item.issueCategoryName,
          code: item.issueCategoryCode,
          status: item.status === 1,
        }));

        // Apply sorting if sortConfig is set
        if (sortConfig.key) {
          sortedRows.sort((a, b) => {
            if (sortConfig.key === 'status') {
              return sortConfig.direction === 'asc' 
                ? (a.status ? 1 : -1) - (b.status ? 1 : -1)
                : (b.status ? 1 : -1) - (a.status ? 1 : -1);
            }
            const aValue = a[sortConfig.key]?.toString().toLowerCase() || '';
            const bValue = b[sortConfig.key]?.toString().toLowerCase() || '';
            return sortConfig.direction === 'asc'
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
          });
        }

        setIssueCategoryRows(sortedRows);
        setTotalIssueCatRecords(res.totalRecords);
      } else {
        setIssueCategoryRows([]);
        setTotalIssueCatRecords(0);
        setStatus(500);
        setMessage(res.message || "Internal Server Error");
        setShowStatus(true);
      }
    } catch (error) {
      console.error("Error in fetchIssueCatList:", error);
      setIssueCategoryRows([]);
      setTotalIssueCatRecords(0);
      setStatus(500);
      setMessage("Internal Server Error");
      setShowStatus(true);
    } finally {
      setTableLoading(false);
    }
  };

  const handleSearchChange = (field, value) => {
    setIssueSearchParams((prev) => ({
      ...prev,
      [field]: value || 0,
    }));
  };

  const handleSearch = () => {
    if (selectedType === "ISSUE") {
      setIssuePage(0);
      setIssueSearchParams(prev => ({
        ...prev,
        pageIndex: 1,
      }));
      setFlag2(!flag2);
    } else {
      setIssueCatPage(0);
      setIssueCatSearchParams(prev => ({
        ...prev,
        pageIndex: 1,
      }));
      setFlag(!flag);
    }
  };

  const handleIssueCancel = () => {
    setShowStatus(false);
    setIssueSearchParams({
      issuesCategoryID: 0,
      issueMasterID: 0,
      pageSize: 10,
      pageIndex: 1,
      CallType: 1,
    });
    setIssuePage(0);
    setIssuePageSize(10);
    setFlag2(!flag2);
  };

  const handleIssueCategoryCancel = () => {
    setShowStatus(false);
    setIssueCatSearchParams({
      issueCategoryID: 0,
      pageSize: 10,
      pageIndex: 1,
    });
    setIssueCatPage(0);
    setIssueCatPageSize(10);
    setFlag(!flag);
  };

  useEffect(() => {
    fetchIssueCategoryDropdown();
  }, []);

  const handleSearchIssueCatChange = (field, value) => {
    setIssueCatSearchParams((prev) => ({
      ...prev,
      [field]: value || 0,
    }));
  };

  const fetchIssueCategoryDropdown = async () => {
    try {
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
    } catch (error) {
      console.error("Error fetching issue categories:", error);
      setIssueCategoryDrop([]);
    }
  };

  return (
    <Grid container spacing={2} sx={{ position: "relative" }}>
      <Grid
        container
        spacing={0}
        lg={12}
        mt={1}
        sx={{ position: "relative", zIndex: 1 }}
      >
       {loading ? <FormSkeleton /> : <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <NuralAccordion2
                title="View"
                backgroundColor={LIGHT_GRAY2}
                controlled={true}
                expanded={accordionExpanded}
                onChange={(event, expanded) => setAccordionExpanded(expanded)}
              >
                {/* First Row - Type Selection */}
                <Grid
                  container
                  spacing={4}
                  mb={3}
                  sx={{
                    gap: { xs: 2, sm: 0, md: 0, lg: 0 },
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={selectedType === "ISSUE" ? 4 : 6}
                    lg={selectedType === "ISSUE" ? 4 : 6}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        ...labelStyle,
                        fontSize: { xs: "12px", sm: "10px" },
                      }}
                      fontWeight={600}
                    >
                      TYPE
                    </Typography>
                    <NuralAutocomplete
                      width="100%"
                      label="Type"
                      options={["ISSUE", "ISSUE CATEGORY"]}
                      placeholder="SELECT"
                      value={selectedType}
                      onChange={(event, newValue) => {
                        setSelectedType(newValue);
                        // Reset page when type changes
                        if (newValue === "ISSUE") {
                          setIssuePage(0);
                        } else {
                          setIssueCatPage(0);
                        }
                      }}
                    />
                  </Grid>
                  {selectedType === "ISSUE" ? (
                    <>
                      <Grid item xs={12} sm={6} md={6} lg={4}>
                        <Typography
                          variant="body1"
                          sx={{
                            ...labelStyle,
                            fontSize: { xs: "12px", sm: "10px" },
                          }}
                          fontWeight={600}
                        >
                          ISSUE CATEGORY
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
                            handleSearchChange(
                              "issuesCategoryID",
                              newValue?.issueCategoryID || null
                            );
                          }}
                          value={
                            issueCategoryDrop.find(
                              (option) =>
                                option.issueCategoryID ===
                                issueSearchParams.issuesCategoryID
                            ) || null
                          }
                        />
                      </Grid>
                      <Grid item xs={12} sm={12} md={6} lg={4}>
                        <Typography
                          variant="body1"
                          sx={{
                            ...labelStyle,
                            fontSize: { xs: "12px", sm: "10px" },
                          }}
                          fontWeight={600}
                        >
                          ISSUE
                        </Typography>
                        <NuralAutocomplete
                          label="Issue"
                          options={issueListDropDown}
                          placeholder="SELECT"
                          width="100%"
                          getOptionLabel={(option) => option.issue || ""}
                          isOptionEqualToValue={(option, value) =>
                            option?.issueMasterID === value?.issueMasterID
                          }
                          onChange={(event, newValue) => {
                            handleSearchChange(
                              "issueMasterID",
                              newValue?.issueMasterID || null
                            );
                          }}
                          value={
                            issueListDropDown.find(
                              (option) =>
                                option.issueMasterID ===
                                issueSearchParams.issueMasterID
                            ) || null
                          }
                          error={!!errors.issueMasterID}
                        />
                      </Grid>
                    </>
                  ) : (
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                      <Typography
                        variant="body1"
                        sx={{
                          ...labelStyle,
                          fontSize: { xs: "12px", sm: "10px" },
                        }}
                        fontWeight={600}
                      >
                        ISSUE CATEGORY
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
                          handleSearchIssueCatChange(
                            "issueCategoryID",
                            newValue?.issueCategoryID || null
                          );
                        }}
                        value={
                          issueCategoryDrop.find(
                            (option) =>
                              option.issueCategoryID ===
                              issueCatSearchParams.issueCategoryID
                          ) || null
                        }
                      />
                    </Grid>
                  )}
                </Grid>

                {/* Second Row - Type Specific Search Fields */}
                <Grid
                  container
                  spacing={0}
                  mb={3}
                  sx={{
                    gap: { xs: 2, sm: 0, md: 0, lg: 0 },
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                ></Grid>

                {/* Third Row - Buttons */}
                <Grid
                  container
                  spacing={2}
                  sx={{
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <Grid item xs={12} sm={3} md={1}>
                    <NuralButton
                      text="CANCEL"
                      variant="outlined"
                      color={PRIMARY_BLUE2}
                      fontSize="12px"
                      height="36px"
                      borderColor={PRIMARY_BLUE2}
                      onClick={
                        selectedType === "ISSUE"
                          ? handleIssueCancel
                          : handleIssueCategoryCancel
                      }
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
                      onClick={handleSearch}
                    >
                      SEARCH
                    </NuralTextButton>
                  </Grid>
                </Grid>
              </NuralAccordion2>
            </Grid>
          </Grid>
        </Grid>}
      </Grid>

      {/* Status Model */}
      <Grid item xs={12} sm={12} md={12} lg={12} pr={2} mt={0.5}>
        {showStatus && (
          <StatusModel width="100%" status={status} title={message} />
        )}
      </Grid>

      {/* Table Section */}
      {accordionExpanded && !showStatus && (
        <Grid item xs={12} sx={{ p: { xs: 1, sm: 2 } }} mt={-2}>
          {selectedType === "ISSUE" ? (
            <IssueTable
              rows={issueRows}
              sortConfig={sortConfig}
              handleSort={handleSort}
              page={issuePage}
              rowsPerPage={issuePageSize}
              totalRows={totalIssueRecords}
              handleToggleChange={handleToggleChange}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              tableLoading={tableLoading}
            />
          ) : (
            <IssueCategoryTable
              rows={issueCategoryRows}
              sortConfig={sortConfig}
              handleSort={handleSort}
              page={issueCatPage}
              rowsPerPage={issueCatPageSize}
              totalRows={totalIssueCatRecords}
              handleToggleChange={handleToggleChange}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              tableLoading={tableLoading}
            />
          )}
        </Grid>
      )}
    </Grid>
  );
};

export default View;
