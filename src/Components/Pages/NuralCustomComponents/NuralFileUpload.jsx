import React, { useRef, useState } from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { DARK_PURPLE, LIGHT_GRAY2 } from "../../Common/colors";

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

const FileItem = styled(Box)({
  display: "flex",
  alignItems: "center",
  padding: "12px 16px",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "rgba(235, 238, 245, 0.8)",
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

const NuralFileUpload = ({ title = "File Upload", ...props }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      props.onChange?.(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <StyledAccordion
      defaultExpanded
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

        // Position
        display: props.display,
        position: props.position,
        top: props.top,
        bottom: props.bottom,
        left: props.left,
        right: props.right,
        zIndex: props.zIndex,

        // Colors
        backgroundColor: props.backgroundColor || LIGHT_GRAY2,
        borderRadius: props.borderRadius || "8px",

        ...props.sx,
      }}
      {...props}
    >
      <StyledAccordionSummary
        expandIcon={
          <ExpandMoreIcon
            sx={{ color: props.expandIconColor || DARK_PURPLE }}
          />
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
        <Box sx={{ padding: "12px 16px", marginBottom: "-30px" }}>
          <Typography
            textAlign={"start"}
            fontSize={"10px"}
            fontWeight={400}
            color={DARK_PURPLE}
          >
            UPLOADED FILE
          </Typography>
        </Box>
        <FileItem
          onClick={handleClick}
          sx={{
            mt: "10px",
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
            <FileIcon>
              <AttachFileIcon />
            </FileIcon>
          </FileContent>
          <HiddenInput
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept={props.accept}
          />
        </FileItem>
      </AccordionDetails>
    </StyledAccordion>
  );
};

export default NuralFileUpload;
