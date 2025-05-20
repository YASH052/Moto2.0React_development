import React, { useRef, useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Skeleton,
  FormHelperText,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { DARK_PURPLE, LIGHT_GRAY2, LIGHT_BLUE } from "../../Common/colors";
import { AccordionFileUploadSkeleton } from "../../Common/SkeletonComponents";
import Required from "../../Common/Required";

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
  "& .MuiAccordionSummary-root": {
    backgroundColor: "transparent ",
    borderRadius: "8px",
    transition: "all 0.3s ease-in-out",
    marginBottom: 0,
  },
  "& .MuiAccordionSummary-content": {
    color: DARK_PURPLE,
  },
  "& .MuiAccordionSummary-expandIconWrapper .MuiSvgIcon-root": {
    color: DARK_PURPLE,
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
  "&.Mui-disabled": {
    backgroundColor: LIGHT_GRAY2,
    opacity: 1,
  },
  "& .Mui-disabled": {
    backgroundColor: LIGHT_GRAY2,
    opacity: 1,
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
  "&.Mui-disabled": {
    opacity: 1,
  },
});

const FileItem = styled(Box)({
  display: "flex",
  alignItems: "center",
  padding: "12px 16px",
  cursor: "pointer",
  "&:hover": {
    // backgroundColor: "rgba(235, 238, 245, 0.8)",
  },
});

const FileContent = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
});

const FileIcon = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(198, 206, 237, 0.5)",
  borderRadius: "4px",
  width: "24px",
  height: "24px",
  "& svg": {
    width: "20px",
    height: "20px",
    color: DARK_PURPLE,
  },
});

const HiddenInput = styled("input")({
  display: "none",
});

const NuralFileUpload = ({
  title = "File Upload",
  fileRef,
  isLoading = false,
  mandatory = false,
  error = false,
  helperText = "",

  resetFile = false,
  showExpandIcon = false,
  ...props
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const internalFileRef = useRef(null);
  const actualFileRef = fileRef || internalFileRef;
  const prevResetFileRef = useRef(resetFile);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      props.onChange?.(file);
    }
  };

  // Reset file selection when resetFile prop changes
  React.useEffect(() => {
    if (resetFile && !prevResetFileRef.current) {
      setSelectedFile(null);
      if (actualFileRef.current) {
        actualFileRef.current.value = "";
      }
    }
    prevResetFileRef.current = resetFile;
  }, [resetFile]);

  const handleClick = () => {
    actualFileRef.current?.click();
  };

  if (isLoading) {
    return <AccordionFileUploadSkeleton sx={props.sx} />;
  }

  return (
    <StyledAccordion
      defaultExpanded
      disabled={!showExpandIcon}
      expanded={!showExpandIcon ? true : undefined}
      sx={{
        backgroundColor: props.backgroundColor || LIGHT_GRAY2,
        borderRadius: props.borderRadius || "8px",
        ...props.sx,
      }}
      {...props}
    >
      <StyledAccordionSummary
        expandIcon={
          showExpandIcon ? (
            <ExpandMoreIcon
              sx={{ color: props.expandIconColor || DARK_PURPLE }}
            />
          ) : null
        }
      >
        <Typography
          sx={{
            fontSize: props.titleFontSize || "14px",
            fontWeight: props.titleFontWeight || 600,
            color: props.titleColor || DARK_PURPLE,
          }}
        >
          {title}
        </Typography>
      </StyledAccordionSummary>
      <AccordionDetails sx={{ padding: 0 }}>
        <Box sx={{ padding: "12px 16px", marginBottom: "-30px", mt: "-10" }}>
          <Typography
            textAlign={"start"}
            fontSize={"10px"}
            fontWeight={400}
            color={DARK_PURPLE}
          >
            UPLOADED FILE {mandatory && <Required />}
          </Typography>
        </Box>
        <FileItem
          onClick={handleClick}
          sx={{
            mt: "5px",
          }}
        >
          <FileIcon>
            <img src={"./Icons/IconPlaceholder.svg"} alt="file" />
          </FileIcon>
          &nbsp; &nbsp;
          <FileContent>
            <Typography
              sx={{
                fontSize: props.fontSize || "14px",
                fontWeight: props.fontWeight || 700,
                color: props.color || DARK_PURPLE,
              }}
            >
              {selectedFile ? selectedFile.name : "File Name"}
            </Typography>
            <Grid
              item
              xs={4}
              sm={4}
              md={4}
              display={"flex"}
              flexWrap={"wrap"}
              alignItems={"center"}
              justifyContent={"end"}
            >
              <img src="./Images/export_btn.svg" alt="" />
            </Grid>
          </FileContent>
          <HiddenInput
            ref={actualFileRef}
            type="file"
            accept={props.accept}
            onChange={handleFileSelect}
          />
        </FileItem>
        {error && helperText && (
          <Box sx={{ padding: "0 16px 12px" }}>
            <Typography
              variant="caption"
              color="error"
              sx={{ fontSize: "0.75rem" }}
            >
              {helperText}
            </Typography>
          </Box>
        )}
      </AccordionDetails>
    </StyledAccordion>
  );
};

export default NuralFileUpload;
