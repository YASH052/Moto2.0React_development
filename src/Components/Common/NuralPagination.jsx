import React, { useState } from "react";
import { Grid, Typography, Button, IconButton } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import { PRIMARY_BLUE2, LIGHT_GRAY2 } from "../Common/colors";
import { jumpToPageStyle, tablePaginationStyle } from "./commonstyles";

const NuralPagination = ({
  totalRecords,
  initialPage = 0,
  initialRowsPerPage = 10,
  onPaginationChange, // Callback to inform parent of changes
}) => {
  const [page, setPage] = useState(initialPage);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [customPageInput, setCustomPageInput] = useState("");

  const totalPages = Math.ceil(totalRecords / rowsPerPage);

  // Notify parent of pagination changes
  const notifyParent = (newPage, newRowsPerPage, type) => {
    if (onPaginationChange) {
      onPaginationChange({
        page: newPage,
        rowsPerPage: newRowsPerPage,
        pageIndex: newPage + 1,
        pageSize: newRowsPerPage,
        type: type
      });
    }
  };

  const handleChangePage = (event, newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
      notifyParent(newPage, rowsPerPage, 'pageChange');
    }
  };

  const handleChangeRowsPerPage = (event) => {
    const newRowsPerPage = parseInt(event.target.value, 10);
    const newPage = 0; // Reset to first page when changing rows per page
    setRowsPerPage(newRowsPerPage);
    setPage(newPage);
    notifyParent(newPage, newRowsPerPage, 'rowsPerPageChange');
  };

  const handleJumpToFirst = () => {
    setPage(0);
    notifyParent(0, rowsPerPage, 'jumpToFirst');
  };

  const handleJumpToLast = () => {
    const lastPage = totalPages - 1;
    if (lastPage >= 0) {
      setPage(lastPage);
      notifyParent(lastPage, rowsPerPage, 'jumpToLast');
    }
  };

  const handleCustomPageInputChange = (e) => {
    setCustomPageInput(e.target.value);
  };

  const handleCustomPageKeyPress = (e) => {
    if (e.key === "Enter") {
      handlePageSearch();
    }
  };

  const handlePageSearch = () => {
    const pageNumber = parseInt(customPageInput, 10);
    if (pageNumber && pageNumber >= 1 && pageNumber <= totalPages) {
      const newPage = pageNumber - 1;
      setPage(newPage);
      notifyParent(newPage, rowsPerPage, 'pageSearch');
      setCustomPageInput("");
    }
  };

  return (
    <Grid
      container
      sx={tablePaginationStyle}
    >
      <Grid item>
        <Typography
          sx={{
            fontFamily: "Manrope",
            fontWeight: 400,
            fontSize: "10px",
            lineHeight: "13.66px",
            letterSpacing: "4%",
            textAlign: "center",
          }}
          variant="body2"
          color="text.secondary"
        >
          TOTAL RECORDS:{" "}
          <span style={{ fontWeight: 700, color: PRIMARY_BLUE2 }}>
            {totalRecords} / {totalPages} PAGES
          </span>
        </Typography>
      </Grid>

      <Grid item>
        <Grid
          container
          spacing={1}
          sx={{
            maxWidth: 300,
            ml: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              fontSize: "10px",
              color: PRIMARY_BLUE2,
              fontWeight: 600,
            }}
          >
            SHOW :
          </Typography>
          {[10, 25, 50, 100].map((value) => (
            <Grid item key={value}>
              <Button
                onClick={() => handleChangeRowsPerPage({ target: { value } })}
                sx={{
                  minWidth: "25px",
                  height: "24px",
                  padding: "4px",
                  borderRadius: "50%",
                  backgroundColor:
                    rowsPerPage === value ? PRIMARY_BLUE2 : "transparent",
                  color: rowsPerPage === value ? "#fff" : PRIMARY_BLUE2,
                  fontSize: "12px",
                  "&:hover": {
                    backgroundColor:
                      rowsPerPage === value ? PRIMARY_BLUE2 : "transparent",
                  },
                  mx: 0.5,
                }}
              >
                {value}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Grid>

      <Grid
        item
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          color: PRIMARY_BLUE2,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontFamily: "Manrope",
            fontWeight: 700,
            fontSize: "8px",
            lineHeight: "10.93px",
            letterSpacing: "4%",
            textAlign: "center",
            cursor: "pointer",
          }}
          onClick={handleJumpToFirst}
        >
          JUMP TO FIRST
        </Typography>
        <IconButton
          onClick={() => handleChangePage(null, page - 1)}
          disabled={page === 0}
        >
          <NavigateBeforeIcon />
        </IconButton>

        <Typography
          sx={{
            fontSize: "10px",
            fontWeight: 700,
          }}
        >
          PAGE {page + 1}
        </Typography>

        <IconButton
          sx={{ cursor: "pointer" }}
          onClick={() => handleChangePage(null, page + 1)}
          disabled={page >= totalPages - 1}
        >
          <NavigateNextIcon />
        </IconButton>

        <Typography
          sx={{
            fontFamily: "Manrope",
            fontWeight: 700,
            fontSize: "8px",
            lineHeight: "10.93px",
            letterSpacing: "4%",
            textAlign: "center",
            cursor: "pointer",
          }}
          onClick={handleJumpToLast}
          variant="body2"
        >
          JUMP TO LAST
        </Typography>
        <input
          type="number"
          placeholder="JUMP TO PAGE"
          min={1}
          max={totalPages}
          value={customPageInput}
          onChange={handleCustomPageInputChange}
          onKeyPress={handleCustomPageKeyPress}
          style={jumpToPageStyle}
        />
        <Grid mt={1} onClick={handlePageSearch}>
          <img
            src="./Icons/footerSearch.svg"
            style={{ cursor: "pointer" }}
            alt="arrow"
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default NuralPagination;
