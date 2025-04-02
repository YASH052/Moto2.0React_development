import React from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { DARK_PURPLE, LIGHT_GRAY2, PRIMARY_BLUE, PRIMARY_BLUE2, ERROR_RED } from "../../Common/colors";
import NuralTextField from "./NuralTextField";

const StyledAccordion = styled(Accordion)({
  backgroundColor: "rgba(235, 238, 245, 0.5)",
  boxShadow: "none",
  borderRadius: "8px !important",
  "&:before": {
    display: "none",
  },
  "&.Mui-expanded": {
    margin: 0,
  },
  "&.MuiAccordion-root": {
    "&:focus": {
      outline: "none",
    },
  },
  "& .MuiButtonBase-root": {
    "&:focus": {
      outline: "none",
    },
  },
});

const StyledAccordionSummary = styled(AccordionSummary)({
  padding: "0 16px",
  "& .MuiAccordionSummary-content": {
    margin: "12px 0",
  },
  "&.MuiButtonBase-root": {
    "&:focus": {
      outline: "none",
    },
  },
});

const FileUploadBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  backgroundColor: "#fff",
  borderRadius: "4px",
  padding: "8px 16px",
  marginTop: "8px",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
});

const FieldContainer = styled(Box)({
  marginBottom: "24px",
});

const FieldRow = styled(Grid)({
  display: "flex",
  alignItems: "flex-end",
  gap: "24px",
});

const TextFieldSection = styled(Grid)({
  flex: "0 0 45%",
  display: "flex",
  flexDirection: "column",
});

const FileUploadSection = styled(Grid)({
  flex: "0 0 45%",
});

const FieldLabel = styled(Typography)({
  fontSize: "12px",
  fontWeight: 400,
  color: PRIMARY_BLUE,
  marginBottom: "8px",
  fontFamily: "Manrope, sans-serif",
});

const HiddenInput = styled("input")({
  display: "none",
});

const ErrorText = styled(Typography)({
  color: ERROR_RED,
  fontSize: "12px",
  marginTop: "4px",
  fontFamily: "Manrope, sans-serif",
  paddingLeft: "8px",
});

const NuralKYCAccordion = ({
  title = "KYC",
  color = DARK_PURPLE,
  fields = [],
  ...props
}) => {
  const [isExpanded, setIsExpanded] = React.useState(true);

  const fileInputRefs = React.useRef([]);

  React.useEffect(() => {
    fileInputRefs.current = fields.map(() => React.createRef());
  }, [fields.length]);

  const handleFileClick = (index) => {
    fileInputRefs.current[index].current?.click();
  };

  const handleFileChange = (index, event) => {
    const file = event.target.files?.[0];
    if (file && fields[index].onFileSelect) {
      // Create object with both file and path info
      const fileData = {
        file: file,
        name: file.name,
        path: URL.createObjectURL(file)
      };
      fields[index].onFileSelect(fileData);
    }
  };

  return (
    <StyledAccordion
      defaultExpanded
      onChange={(_, expanded) => setIsExpanded(expanded)}
      sx={{
        // Size
        width: props.width,
        height: props.height,
        minWidth: props.minWidth,
        maxWidth: props.maxWidth,
        minHeight: props.minHeight,
        maxHeight: props.maxHeight,

        // Margins
        margin: props.margin,
        marginTop: props.marginTop,
        marginBottom: props.marginBottom,
        marginLeft: props.marginLeft,
        marginRight: props.marginRight,

        // Padding
        padding: props.padding,
        paddingTop: props.paddingTop,
        paddingBottom: props.paddingBottom,
        paddingLeft: props.paddingLeft,
        paddingRight: props.paddingRight,

        // Border
        border: props.border,
        borderRadius: props.borderRadius || "8px",
        borderColor: props.borderColor,
        borderWidth: props.borderWidth,
        borderStyle: props.borderStyle,

        // Colors
        backgroundColor: props.backgroundColor || LIGHT_GRAY2,
        color: props.color,

        // Position
        position: props.position,
        top: props.top,
        right: props.right,
        bottom: props.bottom,
        left: props.left,
        zIndex: props.zIndex,

        // Display
        display: props.display,
        alignItems: props.alignItems,
        justifyContent: props.justifyContent,
        flexDirection: props.flexDirection,
        flexWrap: props.flexWrap,
        flex: props.flex,
        gap: props.gap,

        // Other
        boxShadow: props.boxShadow,
        cursor: props.cursor,
        transform: props.transform,
        transition: props.transition,
        opacity: props.opacity,
        overflow: props.overflow,

        "& .MuiAccordionSummary-root": {
          backgroundColor: isExpanded ? DARK_PURPLE : LIGHT_GRAY2,
          borderRadius: "8px",
          transition: "all 0.3s ease-in-out",
          marginBottom: isExpanded ? "10px" : 0,
        },
        "& .MuiAccordionSummary-content": {
          color: isExpanded ? "white" : DARK_PURPLE,
        },
        "& .MuiAccordionSummary-expandIconWrapper .MuiSvgIcon-root": {
          color: isExpanded ? "white" : DARK_PURPLE,
        },

        ...props.sx,
      }}
      {...props}
    >
      <StyledAccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={props.summaryStyle}
      >
        <Typography
          sx={{
            fontSize: props.titleFontSize || "14px",
            fontWeight: props.titleFontWeight || 800,
            fontFamily: "Manrope, sans-serif",
            ...props.titleStyle,
          }}
        >
          {title}
        </Typography>
      </StyledAccordionSummary>
      <AccordionDetails
        sx={{
          padding: props.detailsPadding || "16px",
          ...props.detailsStyle,
        }}
      >
        {fields.map((field, index) => (
          <FieldContainer key={index} sx={props.fieldContainerStyle}>
            <FieldRow>
              <TextFieldSection
                sx={{
                  display: "block",
                  textAlign: "left",
                }}
              >
                <FieldLabel
                  sx={{
                    textAlign: "left",
                  }}
                >
                  {field.label}
                </FieldLabel>
                <NuralTextField
                  placeholder={field.placeholder}
                  display="block"
                  textAlign="left"
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  error={field.error}
                  errorMessage={field.errorMessage}
                  {...field.inputProps}
                />
              </TextFieldSection>

              {field.onFileSelect && (
                <FileUploadSection>
                  <FieldLabel
                    sx={{
                      textAlign: "left",
                    }}
                  >
                    UPLOAD FILE
                  </FieldLabel>
                  <FileUploadBox
                    onClick={() => handleFileClick(index)}
                    sx={{
                      ...props.fileUploadStyle,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Box
                        sx={{
                          width: "24px",
                          height: "24px",
                          backgroundColor: "rgba(198, 206, 237, 0.5)",
                          borderRadius: "4px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          ...props.fileIconBoxStyle,
                        }}
                      >
                        <img src="./Icons/IconPlaceholder.svg" alt="file" />
                      </Box>
                      <Typography
                        sx={{
                          fontSize: "14px",
                          fontWeight: 500,
                          color: color,
                          fontFamily: "Manrope, sans-serif",
                          ...props.fileNameStyle,
                        }}
                      >
                        {field.fileName || "File Name"}
                      </Typography>
                    </Box>
                    <AttachFileIcon sx={{ color: color }} />
                  </FileUploadBox>
                  <HiddenInput
                    ref={fileInputRefs.current[index]}
                    type="file"
                    accept={field.accept || ".pdf,.jpg,.jpeg,.png"}
                    onChange={(e) => handleFileChange(index, e)}
                  />
                </FileUploadSection>
              )}
            </FieldRow>
          </FieldContainer>
        ))}
      </AccordionDetails>
    </StyledAccordion>
  );
};

export default NuralKYCAccordion;
