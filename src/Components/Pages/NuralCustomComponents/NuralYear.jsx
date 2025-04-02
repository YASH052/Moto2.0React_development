import React, { useState } from 'react';
import { FormControl, Select, MenuItem } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// Colors from the NuralAutocomplete component
const PRIMARY_BLUE2 = '#283352'; // Based on the border color used in NuralAutocomplete
const LIGHT_GRAY2 = '#EBF1FA'; // Based on the background color used

const YearDropdown = ({
  onChange,
  value,
  id = "year-select",
  width,
  height = "36px",
  placeholder = "Select",
  ...props
}) => {
  // Get the current year and calculate the last 5 years
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, index) => currentYear - index);
  
  return (
    <FormControl
      sx={{
        width: width || "100%",
        height: height,
        minWidth: props.minWidth,
        maxWidth: props.maxWidth,
        margin: props.margin,
        marginTop: props.marginTop,
        marginBottom: props.marginBottom,
        marginLeft: props.marginLeft,
        marginRight: props.marginRight,
        padding: props.padding,
        display: props.display,
        position: props.position,
        top: props.top,
        bottom: props.bottom,
        left: props.left,
        right: props.right,
        zIndex: props.zIndex,
      }}
    >
      <Select
        labelId={`${id}-label`}
        id={id}
        value={value}
        onChange={(e) => onChange({ value: e.target.value })}
        displayEmpty
        IconComponent={KeyboardArrowDownIcon}
        renderValue={(selected) => {
          if (!selected) {
            return <span style={{ 
              color: '#18244E', 
              fontSize: props.fontSize || "12px",
              fontWeight: props.fontWeight || 600
            }}>{placeholder}</span>;
          }
          return selected;
        }}
        sx={{
          height: height,
          minHeight: props.minHeight,
          maxHeight: props.maxHeight, 
          backgroundColor: props.backgroundColor || LIGHT_GRAY2,
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '& .MuiSvgIcon-root': {
            color: PRIMARY_BLUE2,
            marginRight: '8px',
          },
          '&:hover': {
            backgroundColor: props.hoverBackgroundColor || LIGHT_GRAY2,
          },
          '& .MuiSelect-select': {
            height: '100% !important',
            padding: '0 14px !important',
            fontSize: props.fontSize || "12px",
            fontWeight: props.fontWeight || 600,
            lineHeight: props.lineHeight,
            color: props.color || '#18244E',
            display: 'flex',
            alignItems: 'center',
          },
          border: props.border || `1.8px solid ${PRIMARY_BLUE2}`,
          borderRadius: props.borderRadius || "8px",
          "&:hover": {
            border: props.hoverBorder || `1.8px solid ${PRIMARY_BLUE2}`,
          },
          "&.Mui-focused": {
            border: props.focusBorder || `1.8px solid ${PRIMARY_BLUE2}`,
            backgroundColor: props.focusBackgroundColor || LIGHT_GRAY2,
          },
          "&.Mui-disabled": {
            backgroundColor: props.disabledBackgroundColor,
            color: props.disabledColor,
          },
          ...props.sx,
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              borderRadius: '8px',
              marginTop: '4px',
              "& .MuiMenuItem-root": {
                fontSize: props.fontSize || "12px",
                "&.Mui-selected": {
                  backgroundColor: `${LIGHT_GRAY2} !important`,
                }
              }
            }
          }
        }}
      >
        {years.map((year) => (
          <MenuItem key={year} value={year}>
            {year}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default YearDropdown;