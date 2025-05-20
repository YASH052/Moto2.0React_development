import React from "react";
import {
  Grid,
  Typography,
  Select,
  MenuItem,
  Switch,
  IconButton,
  TextField,
  FormControl,
  Button,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  PRIMARY_BLUE2,
  LIGHT_BLUE,
  DARK_BLUE,
  MEDIUM_BLUE,
  LIGHT_GRAY,
  LIGHT_GRAY2,
  DARK_PURPLE,
} from "../../../../Common/colors"; // Adjust path as needed
import { toggleSectionStyle } from "../../../../Common/commonstyles";

// Common style to remove outline on focus/click
const noOutlineStyle = {
  outline: "none",
  "&:focus": {
    outline: "none",
  },
  "&.Mui-focused": {
    outline: "none",
  },
};

const labelStyle = {
  fontFamily: "Manrope",
  fontWeight: 700,
  fontSize: "14px",
  lineHeight: "100%",
  letterSpacing: "4%",
  verticalAlign: "middle",

  color: DARK_PURPLE,
};

const buttonTextStyle = {
  fontSize: "12px",
  fontWeight: 600,
  color: PRIMARY_BLUE2,
  textTransform: "uppercase",
  display: "flex",
  alignItems: "center",
  gap: 1,
};

const QuestionSettings = ({
  question,
  index,
  questionTypes = [
    { id: 1, name: "Yes" },
    { id: 2, name: "No" },
  ], // Default or pass from parent
  onTypeChange,
  onDuplicate,
  onDelete,
  onToggleImageRequired,
  onImageCountChange,
  onToggleOtherOption,
  totalQuestions, // To disable delete for the last question
}) => {
  const { questionTypeId, isImgRequired, imgCount, isOtherOptionSelected } =
    question;

  const handleImageSwitchChange = (event) => {
    onToggleImageRequired(index, event.target.checked);
  };

  const handleOtherOptionSwitchChange = (event) => {
    onToggleOtherOption(index, event.target.checked);
  };

  const handleIncrement = () => {
    onImageCountChange(index, imgCount + 1);
  };

  const handleDecrement = () => {
    // Prevent going below 1
    if (imgCount > 1) {
      onImageCountChange(index, imgCount - 1);
    }
  };

  const handleCountInputChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      onImageCountChange(index, value);
    } else if (event.target.value === "") {
      // Allow clearing the input, maybe default to 1 or handle as needed
      onImageCountChange(index, 1); // Or handle differently
    }
  };

  const handleTypeSelectChange = (event) => {
    onTypeChange(index, event.target.value);
  };

  return (
    <Grid container direction="column" spacing={2}>
      {/* Question Type Dropdown */}

      {/* Settings Accordion */}
      <Grid item>
        <Accordion
          defaultExpanded
          sx={{
            backgroundColor: MEDIUM_BLUE,
            borderRadius: "8px !important",
            boxShadow: "none",
            "&:before": {
              display: "none",
            },
            "&.Mui-expanded": {
              margin: 0,
            },
            "& .MuiAccordionSummary-root": {
              minHeight: "auto",
              padding: "0 16px",
              "&.Mui-expanded": {
                minHeight: "48px",
              },
              ...noOutlineStyle, // Add no outline style
            },
            "& .MuiAccordionSummary-content": {
              margin: "12px 0",
              "&.Mui-expanded": {
                margin: "12px 0",
              },
            },
            "& .MuiAccordionDetails-root": {
              padding: "8px 16px 16px",
            },
            ...noOutlineStyle, // Add no outline style to accordion itself
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="question-settings-content"
            id="question-settings-header"
          >
            <Typography sx={{ ...labelStyle, mb: 0 }}>Question</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container direction="column" spacing={2}>
              {/* Duplicate Button */}
              <Grid item>
                <FormControl fullWidth size="small">
                  <select
                    name=""
                    id=""
                    style={{
                      backgroundColor: LIGHT_GRAY2,
                      color: DARK_PURPLE,
                      borderRadius: "8px",
                      padding: "8px ",
                      fontWeight: 700,
                      border: "none",
                      fontSize: "14px",
                      lineHeight: "100%",
                      letterSpacing: "4%",
                    }}
                  >
                    <option value="">Select Question Type</option>
                    {questionTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </FormControl>
              </Grid>
              <Grid item>
                <Button
                  variant="text"
                  sx={{
                    p: 0,
                    justifyContent: "flex-start",
                    ...noOutlineStyle, // Add no outline style
                  }}
                  onClick={() => onDuplicate(index)}
                >
                  <Box sx={buttonTextStyle}>
                    DUPLICATE <ContentCopyIcon sx={{ fontSize: 16 }} />
                  </Box>
                </Button>
              </Grid>

              {/* Delete Button */}
              <Grid item>
                <Button
                  variant="text"
                  sx={{
                    p: 0,
                    justifyContent: "flex-start",
                    ...noOutlineStyle, // Add no outline style
                  }}
                  onClick={() => onDelete(index)}
                  disabled={totalQuestions <= 1}
                >
                  <Box
                    sx={{
                      ...buttonTextStyle,
                      color: totalQuestions <= 1 ? "grey" : PRIMARY_BLUE2,
                    }}
                  >
                    DELETE <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                  </Box>
                </Button>
              </Grid>

              {/* Image Required Switch */}
              <Grid item>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: LIGHT_GRAY2,
                    p: 1,
                    borderRadius: "8px",
                  }}
                >
                  <Typography sx={labelStyle}>Image Required</Typography>
                  <Switch
                    checked={isImgRequired}
                    onChange={handleImageSwitchChange}
                    sx={{
                      ...toggleSectionStyle,
                      ...noOutlineStyle, // Add no outline style
                      "& .MuiSwitch-thumb": {
                        backgroundColor: isImgRequired
                          ? PRIMARY_BLUE2
                          : DARK_PURPLE,
                      },
                    }}
                  />
                </Box>
              </Grid>

              {/* Image Count Input (Conditional) */}
              {!!isImgRequired && (
                <Grid item>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={handleDecrement}
                      disabled={imgCount <= 1}
                      sx={{
                        border: `1px solid ${PRIMARY_BLUE2}`,
                        borderRadius: "4px",
                        color: PRIMARY_BLUE2,
                        ...noOutlineStyle, // Add no outline style
                      }}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <TextField
                      type="number"
                      value={imgCount}
                      onChange={handleCountInputChange}
                      size="small"
                      InputProps={{
                        inputProps: {
                          min: 1,
                          style: { textAlign: "center", width: "40px" },
                        },
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                          backgroundColor: LIGHT_BLUE,
                          "& input": {
                            padding: "8px",
                          },
                          ...noOutlineStyle, // Add no outline style
                          "& fieldset": {
                            "&:focus": {
                              borderColor: "transparent",
                            },
                          },
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "transparent",
                          "&:focus": {
                            borderColor: "transparent",
                          },
                        },
                        ...noOutlineStyle, // Add no outline style
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={handleIncrement}
                      sx={{
                        border: `1px solid ${PRIMARY_BLUE2}`,
                        borderRadius: "4px",
                        color: PRIMARY_BLUE2,
                        ...noOutlineStyle, // Add no outline style
                      }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Grid>
              )}

              {/* Add Others Switch */}
              <Grid item>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: LIGHT_GRAY2,

                    p: 1,
                    borderRadius: "8px",
                  }}
                >
                  <Typography sx={labelStyle}>Add 'Others'</Typography>
                  <Switch
                    checked={isOtherOptionSelected}
                    onChange={handleOtherOptionSwitchChange}
                    sx={{
                      ...toggleSectionStyle,
                      ...noOutlineStyle, // Add no outline style
                      "& .MuiSwitch-thumb": {
                        backgroundColor: isOtherOptionSelected
                          ? PRIMARY_BLUE2
                          : DARK_PURPLE,
                      },
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid>
  );
};

export default QuestionSettings;
