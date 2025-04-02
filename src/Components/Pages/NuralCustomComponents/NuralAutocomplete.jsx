import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import React, { useState, useMemo } from "react";
import {
  LIGHT_GRAY2,
  PRIMARY_BLUE2,
  PRIMARY_LIGHT_GRAY,
} from "../../Common/colors";

const NuralAutocomplete = ({
  options,
  label,
  placeholder,
  width,
  getOptionLabel,
  isOptionEqualToValue,
  onChange,
  value,
  loading = false,
  error = false,
  helperText = "",
  filterOptions,
  ...props
}) => {
  const [inputValue, setInputValue] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);

  // Memoize filtered options based on input value
  const filteredOptions = useMemo(() => {
    if (!filterOptions) return options;
    return filterOptions(options, { inputValue });
  }, [options, inputValue, filterOptions]);

  const handleChange = (event, newValue) => {
    console.log(newValue);
  };

  return (
    <Autocomplete
      options={filteredOptions}
      getOptionLabel={getOptionLabel || ((option) => option)}
      isOptionEqualToValue={isOptionEqualToValue || ((option, value) => {
        // If the options are objects, try to use an id or unique identifier
        if (typeof option === 'object' && option !== null) {
          return option.id === value.id;
        }
        // For primitive values, use direct comparison
        return option === value;
      })}
      onChange={onChange}
      value={value}
      loading={loading}
      loadingText="Loading..."
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderOption={(props, option, state) => {
        // Generate a unique key based on the option's properties
        const key = typeof option === 'object' && option !== null
          ? (option.id || JSON.stringify(option))
          : String(option);
        
        return (
          <li {...props} key={key}>
            {getOptionLabel ? getOptionLabel(option) : String(option)}
          </li>
        );
      }}
      ListboxProps={{
        style: {
          maxHeight: 300,
          overflow: 'auto',
        },
      }}
      sx={{
        width: width || "100%",
        height: props.height || "36px",
        minWidth: props.minWidth,
        maxWidth: props.maxWidth,
        margin: props.margin,
        marginTop: props.marginTop,
        marginBottom: props.marginBottom,
        marginLeft: props.marginLeft,
        marginRight: props.marginRight,
        padding: props.padding,
        paddingTop: props.paddingTop,
        paddingBottom: props.paddingBottom,
        paddingLeft: props.paddingLeft,
        paddingRight: props.paddingRight,
        display: props.display,
        position: props.position,
        top: props.top,
        bottom: props.bottom,
        left: props.left,
        right: props.right,
        zIndex: props.zIndex,
        "& .MuiInputBase-root": {
          height: props.height || "36px",
          minHeight: props.minHeight,
          maxHeight: props.maxHeight,
          backgroundColor: props.backgroundColor || LIGHT_GRAY2,
          borderRadius: props.borderRadius || "8px",
          fontSize: props.fontSize || "12px",
          fontWeight: props.fontWeight,
          lineHeight: props.lineHeight,
          padding: "0 !important",
          "& fieldset": {
            border: "none",
          },
          "&:hover fieldset": {
            border: "none",
          },
          "&.Mui-focused fieldset": {
            border: "none",
          },
          "& input": {
            height: "100% !important",
            padding: "0 14px !important",
            color: props.color || "#18244E",
            "&::placeholder": {
              fontWeight: 600,
              letterSpacing: "5%",
              textAlign: "start",
              color: props.placeholderColor,
              opacity: 1,
              verticalAlign: "middle",
              lineHeight: "normal",
            },
          },
          "&:hover": {
            backgroundColor: props.hoverBackgroundColor,
          },
          "&.Mui-focused": {
            backgroundColor: props.focusBackgroundColor,
          },
          "&.Mui-disabled": {
            backgroundColor: props.disabledBackgroundColor,
            color: props.disabledColor,
          },
        },
        ...props.sx,
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          error={error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
          sx={{
            border: error 
              ? "1.8px solid #d32f2f" 
              : (props.border || `1.8px solid ${PRIMARY_BLUE2}`),
            borderRadius: props.borderRadius || "8px",
            height: "100%",
            "& .MuiInputBase-root": {
              height: "100%",
            },
            "&:hover": {
              border: error 
                ? "1.8px solid #d32f2f" 
                : props.hoverBorder,
            },
            "&:focus-within": {
              border: error 
                ? "1.8px solid #d32f2f" 
                : (props.focusBorder || `1.8px solid ${PRIMARY_BLUE2}`),
              outline: "none",
            },
            "& .MuiInputBase-input::placeholder": {
              opacity: 1,
            },
            "& .MuiFormHelperText-root": {
              marginLeft: 0,
              fontSize: "10px",
              marginTop: "4px",
              color: "#d32f2f",
            },
          }}
        />
      )}
      {...props}
    />
  );
};

export default NuralAutocomplete;
