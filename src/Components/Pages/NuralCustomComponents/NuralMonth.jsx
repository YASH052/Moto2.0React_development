import React, { useState } from 'react';
import { FormControl, Select, MenuItem } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

// Colors from the NuralAutocomplete component
const PRIMARY_BLUE2 = '#283352'; // Based on the border color used in NuralAutocomplete
const LIGHT_GRAY2 = '#EBF1FA'; // Based on the background color used

const MonthDropdown = ({
  onChange,
  value,
  id = "month-select",
  width,
  height = "36px",
  placeholder = "Select",
  error,
  ...props
}) => {
  const months = [
    { label: "January", value: 1 },
    { label: "February", value: 2 },
    { label: "March", value: 3 },
    { label: "April", value: 4 },
    { label: "May", value: 5 },
    { label: "June", value: 6 },
    { label: "July", value: 7 },
    { label: "August", value: 8 },
    { label: "September", value: 9 },
    { label: "October", value: 10 },
    { label: "November", value: 11 },
    { label: "December", value: 12 },
  ];
  
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
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        displayEmpty
        IconComponent={KeyboardArrowDownIcon}
        error={error}
        renderValue={(selected) => {
          if (!selected) {
            return <span style={{ 
              color: '#18244E', 
              fontSize: props.fontSize || "12px",
              fontWeight: props.fontWeight || 600
            }}>{placeholder}</span>;
          }
          return months.find(month => month.value === selected)?.label || '';
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
          border: error ? '1.8px solid #d32f2f' : (props.border || `1.8px solid ${PRIMARY_BLUE2}`),
          borderRadius: props.borderRadius || "8px",
          "&:hover": {
            border: error ? '1.8px solid #d32f2f' : (props.hoverBorder || `1.8px solid ${PRIMARY_BLUE2}`),
          },
          "&.Mui-focused": {
            border: error ? '1.8px solid #d32f2f' : (props.focusBorder || `1.8px solid ${PRIMARY_BLUE2}`),
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
              maxHeight: '256px', // Approximately 8 items (32px per item)
              "& .MuiMenuItem-root": {
                fontSize: props.fontSize || "12px",
                height: '32px', // Fixed height for each item
                "&.Mui-selected": {
                  backgroundColor: `${LIGHT_GRAY2} !important`,
                }
              }
            }
          }
        }}
      >
        {months.map((month) => (
          <MenuItem key={month.value} value={month.value}>
            {month.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default MonthDropdown;