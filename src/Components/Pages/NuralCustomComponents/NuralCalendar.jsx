import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  styled,
  Modal,
  TextField,
  ClickAwayListener,
} from "@mui/material";
import {
  AQUA,
  DARK_PURPLE,
  MEDIUM_BLUE,
  PRIMARY_BLUE2,
  PRIMARY_LIGHT_PURPLE,
  PRIMARY_LIGHT_PURPLE2,
} from "../../Common/colors";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const CalendarContainer = styled(Box)({
  width: "320px",
  padding: "20px",
  backgroundColor: "#F8F9FC",
  borderRadius: "12px",
  border: `1px solid ${PRIMARY_LIGHT_PURPLE2}`,
  boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
});

const CalendarHeader = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
});

const HeaderTitle = styled(Box)({
  display: "flex",
  gap: "8px",
  color: DARK_PURPLE,
  fontWeight: "600",
});

const HeaderText = styled(Typography)({
  fontSize: "16px",
  fontWeight: 600,
  color: DARK_PURPLE,
  cursor: "pointer",
  "&:hover": {
    opacity: 0.8,
  },
});

const SelectionGrid = styled(Box)({
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "8px",
  padding: "8px",
  height: "100%",
  alignContent: "start",
});

const SelectionCell = styled(Box)(({ isSelected }) => ({
  padding: "8px",
  textAlign: "center",
  cursor: "pointer",
  borderRadius: "20px",
  backgroundColor: isSelected ? AQUA : "transparent",
  color: isSelected ? "#fff" : DARK_PURPLE,
  height: "36px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "&:hover": {
    backgroundColor: isSelected ? AQUA : "rgba(198, 206, 237, 0.2)",
  },
}));

const WeekDaysContainer = styled(Box)({
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  gap: "8px",
  marginBottom: "8px",
});

const WeekDay = styled(Typography)({
  fontSize: "12px",
  fontWeight: 600,
  color: DARK_PURPLE,
  textAlign: "center",
});

const DaysGrid = styled(Box)({
  display: "grid",
  gridTemplateColumns: "repeat(7, 1fr)",
  gap: "8px",
  height: "100%",
  alignContent: "start",
});

const DayCell = styled(Box)(({ isSelected, isToday, isCurrentMonth }) => ({
  height: "36px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
  cursor: isCurrentMonth ? "pointer" : "default",
  fontSize: "14px",
  fontWeight: isToday || isSelected ? 600 : 400,
  backgroundColor: isSelected ? AQUA : isToday ? "#e0e0e0" : "transparent",
  color: !isCurrentMonth ? "transparent" : isSelected ? "#fff" : isToday ? DARK_PURPLE : DARK_PURPLE,
  visibility: isCurrentMonth ? "visible" : "hidden",
  "&:hover": {
    backgroundColor: isCurrentMonth
      ? isSelected
        ? AQUA
        : "rgba(198, 206, 237, 0.2)"
      : "transparent",
  },
}));

const CalendarContent = styled(Box)({
  padding: "8px",
  gap: "8px",
  borderRadius: "8px",
  borderWidth: "1px",
  border: `1px solid ${PRIMARY_LIGHT_PURPLE2}`,
  height: "280px",
  display: "flex",
  flexDirection: "column",
});

// Add a styled component for the navigation buttons
const StyledIconButton = styled(IconButton)({
  "&:focus": {
    outline: "none",
  },
  "&:hover": {
    backgroundColor: "transparent",
  },
});

const CalendarModal = styled(Box)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  outline: "none",
});

const DateTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    height: "40px",
    "& fieldset": {
      borderColor: PRIMARY_LIGHT_PURPLE2,
    },
    "&:hover fieldset": {
      borderColor: PRIMARY_LIGHT_PURPLE2,
    },
    "&.Mui-focused fieldset": {
      borderColor: PRIMARY_BLUE2,
    },
    "& input": {
      borderRadius: "8px",
      padding: "0 8px",
      fontSize: "14px",
      height: "25px",
      textTransform: "uppercase",
    },
    "& .MuiInputAdornment-root": {
      height: "25px",
      marginLeft: "0",
    },
  },
  "& .MuiInputAdornment-root": {
    cursor: "pointer",
  },
});

const NuralCalendar = ({
  value,
  onChange,
  onDateSelect,
  onMonthChange,
  onYearChange,
  onNavigate,
  initialDate,
  minDate,
  maxDate,
  disabledDates,
  highlightedDates,
  disableFutureDates = true,
  yearRange = {
    start: 2000,
    end: new Date().getFullYear(),
  },
  // Style props
  containerStyle = {},
  headerStyle = {},
  monthYearStyle = {},
  weekDayStyle = {},
  dayStyle = {},
  selectedDayStyle = {},
  todayStyle = {},
  disabledDayStyle = {},
  navigationButtonStyle = {},
  yearGridStyle = {},
  monthGridStyle = {},
  error,
  ...props
}) => {
  // Ensure initialDate is a valid Date object
  const getValidDate = (date) => {
    if (!date) return new Date();
    
    // If it's already a Date object
    if (date instanceof Date && !isNaN(date.getTime())) {
      return date;
    }
    
    // If it's a string, try to parse it
    try {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        return parsedDate;
      }
    } catch (e) {
      console.warn("Invalid date format:", date);
    }
    
    // Default to current date if invalid
    return new Date();
  };

  // Initialize with valid Date objects
  const [currentDate, setCurrentDate] = useState(getValidDate(initialDate));
  const [selectedDate, setSelectedDate] = useState(getValidDate(value || initialDate));
  const [showYearGrid, setShowYearGrid] = useState(false);
  const [showMonthGrid, setShowMonthGrid] = useState(false);
  const [yearOffset, setYearOffset] = useState(0);
  const [openCalendar, setOpenCalendar] = useState(false);
  const anchorRef = useRef(null);

  // Effect to update the current date when the calendar opens
  useEffect(() => {
    if (openCalendar) {
      // If there's a value, open calendar to that date
      // Otherwise use today's date
      if (value) {
        const valueDate = getValidDate(value);
        setCurrentDate(valueDate);
      } else {
        setCurrentDate(new Date());
      }
    }
  }, [openCalendar, value]);

  // Effect to update selected date when value changes
  useEffect(() => {
    if (value) {
      setSelectedDate(getValidDate(value));
    }
  }, [value]);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  // Generate years based on yearRange
  const getYearsToShow = () => {
    const startYear = yearRange.start + yearOffset;
    const endYear = yearRange.end;
    // Ensure we include the current year in the range
    return Array.from(
      { length: Math.min(12, endYear - startYear + 1) },
      (_, i) => startYear + i
    ).filter((year) => year <= endYear);
  };

  const isDateDisabled = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if future dates are disabled
    if (disableFutureDates) {
      // Create date objects with time set to noon to avoid timezone issues
      const dateToCheck = new Date(date.getTime());
      dateToCheck.setHours(12, 0, 0, 0);
      
      const todayNoon = new Date(today.getTime());
      todayNoon.setHours(12, 0, 0, 0);
      
      if (dateToCheck > todayNoon) return true;
    }
    
    if (minDate && date < getValidDate(minDate)) return true;
    if (maxDate && date > getValidDate(maxDate)) return true;
    
    if (!disabledDates || !Array.isArray(disabledDates)) return false;
    
    return disabledDates.some(
      (disabled) => {
        if (!disabled) return false;
        try {
          const disabledDate = getValidDate(disabled);
          return date.getTime() === disabledDate.getTime();
        } catch (e) {
          return false;
        }
      }
    );
  };

  const isDateHighlighted = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime()) || !highlightedDates || !Array.isArray(highlightedDates)) return false;
    
    return highlightedDates.some(
      (highlighted) => {
        if (!highlighted) return false;
        try {
          const highlightedDate = getValidDate(highlighted);
          return date.getTime() === highlightedDate.getTime();
        } catch (e) {
          return false;
        }
      }
    );
  };

  const handleYearClick = (year) => {
    // Allow selection up to the current year
    if (year <= yearRange.end) {
      try {
        const oldDate = new Date(selectedDate.getTime());
        const oldDay = oldDate.getDate();
        const oldMonth = oldDate.getMonth();
        
        // Create new date with the selected year but same month/day
        const newDate = new Date(year, oldMonth, 1); // Start with 1st of month
        
        // Check if the original day is valid in the new month/year
        // (handles cases like Feb 29 in non-leap years)
        const lastDayOfMonth = new Date(year, oldMonth + 1, 0).getDate();
        const validDay = Math.min(oldDay, lastDayOfMonth);
        
        // Set to the valid day (either original day or last day of month)
        newDate.setDate(validDay);
        
        // Make sure it's a valid date
        if (isNaN(newDate.getTime())) {
          throw new Error("Invalid date");
        }
        
        setCurrentDate(newDate);
        setSelectedDate(newDate);
        setShowYearGrid(false);
        onYearChange?.(newDate);
        onDateSelect?.(newDate);
      } catch (e) {
        console.error("Error creating new date with year", e);
      }
    }
  };

  const handleMonthClick = (monthIndex) => {
    const newDate = new Date(selectedDate.getTime());
    newDate.setMonth(monthIndex);
    setCurrentDate(newDate);
    setSelectedDate(newDate);
    setShowMonthGrid(false);
    onMonthChange?.(newDate);
    onDateSelect?.(newDate);
  };

  const toggleYearGrid = () => {
    setShowYearGrid(!showYearGrid);
    setShowMonthGrid(false);
    
    // When opening year grid, adjust the yearOffset to make sure current year is visible
    if (!showYearGrid) {
      const currentYear = new Date().getFullYear();
      const offsetNeeded = Math.max(0, Math.floor((currentYear - yearRange.start) / 12) * 12);
      setYearOffset(offsetNeeded);
    }
  };

  const toggleMonthGrid = () => {
    setShowMonthGrid(!showMonthGrid);
    setShowYearGrid(false);
  };

  const handlePreviousClick = () => {
    if (showYearGrid) {
      // Navigate to previous set of years
      if (yearOffset - 12 >= 0) {
        setYearOffset(yearOffset - 12);
      }
    } else {
      // Navigate to previous month
      const newDate = new Date(currentDate.getTime());
      newDate.setMonth(newDate.getMonth() - 1);
      setCurrentDate(newDate);
      setSelectedDate(newDate);
      onNavigate?.("prev", newDate);
      onDateSelect?.(newDate);
    }
  };

  const handleNextClick = () => {
    if (showYearGrid) {
      // Navigate to next set of years
      const nextOffset = yearOffset + 12;
      const maxOffset = yearRange.end - yearRange.start;
      if (nextOffset <= maxOffset) {
        setYearOffset(nextOffset);
      }
    } else {
      // Navigate to next month
      const newDate = new Date(currentDate.getTime());
      newDate.setMonth(newDate.getMonth() + 1);
      setCurrentDate(newDate);
      setSelectedDate(newDate);
      onNavigate?.("next", newDate);
      onDateSelect?.(newDate);
    }
  };

  const handleDateClick = (day, isCurrentMonth) => {
    if (isCurrentMonth) {
      try {
        // Create date at start of day in local timezone
        const newDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          day,
          12  // Set to noon to avoid timezone issues
        );
        
        // Make sure it's a valid date
        if (isNaN(newDate.getTime())) {
          throw new Error("Invalid date");
        }
        
        // Check if the date is disabled (including future dates check)
        if (isDateDisabled(newDate)) return;
        
        setCurrentDate(newDate);
        setSelectedDate(newDate);
        onChange?.(newDate);
        setOpenCalendar(false);
      } catch (e) {
        console.error("Error creating new date", e);
      }
    }
  };

  const isToday = (day) => {
    if (!day) return false;
    
    try {
      const today = new Date();
      return (
        day === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear()
      );
    } catch (e) {
      return false;
    }
  };

  const isSelected = (day) => {
    if (!day || !selectedDate || !(selectedDate instanceof Date) || isNaN(selectedDate.getTime())) {
      return false;
    }
    
    try {
      return (
        day === selectedDate.getDate() &&
        currentDate.getMonth() === selectedDate.getMonth() &&
        currentDate.getFullYear() === selectedDate.getFullYear()
      );
    } catch (e) {
      console.error("Error in isSelected", e);
      return false;
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];

    // Add empty cells for the days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push({
        day: "",
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
      });
    }

    // Add empty cells for the remaining days to complete the grid
    const remainingDays = 42 - days.length;
    for (let i = 0; i < remainingDays; i++) {
      days.push({
        day: "",
        isCurrentMonth: false,
      });
    }

    return days;
  };

  // Format date for display in TextField
  const formatDate = (date) => {
    if (!date) return "";
    
    try {
      let dateObj;
      if (typeof date === 'string') {
        // Parse string date and set to noon to avoid timezone issues
        dateObj = new Date(date);
        dateObj.setHours(12, 0, 0, 0);
      } else if (date instanceof Date) {
        dateObj = new Date(date);
        dateObj.setHours(12, 0, 0, 0);
      } else {
        return "";
      }

      if (isNaN(dateObj.getTime())) return "";

      const day = dateObj.getDate().toString().padStart(2, "0");
      const month = dateObj.toLocaleString("en-US", { month: "short" });
      const year = dateObj.getFullYear();

      return `${day}-${month}-${year}`;
    } catch (e) {
      console.error("Error formatting date", e);
      return "";
    }
  };

  const handleCalendarOpen = () => {
    // Reset to date view whenever calendar opens
    setShowYearGrid(false);
    setShowMonthGrid(false);
    setOpenCalendar(true);
  };

  const handleCalendarClose = () => {
    setOpenCalendar(false);
    // No need to reset view state here as it will be reset on next open
  };

  return (
    <Box ref={anchorRef}>
      <DateTextField
        fullWidth
        placeholder="DD/MMM/YY"
        value={formatDate(value)}
        onClick={handleCalendarOpen}
        error={error}
        InputProps={{
          readOnly: true,
          endAdornment: (
            <CalendarTodayIcon
              sx={{
                color: error ? 'error.main' : PRIMARY_BLUE2,
                cursor: "pointer",
                fontSize: "18px",
              }}
              onClick={handleCalendarOpen}
            />
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderColor: error ? 'error.main' : PRIMARY_LIGHT_PURPLE2,
            '&:hover fieldset': {
              borderColor: error ? 'error.main' : PRIMARY_LIGHT_PURPLE2,
            },
          }
        }}
        {...props}
      />

      <Modal
        open={openCalendar}
        onClose={handleCalendarClose}
        aria-labelledby="calendar-modal"
      >
        <ClickAwayListener onClickAway={handleCalendarClose}>
          <CalendarModal>
            <CalendarContainer sx={{ ...containerStyle, ...props.sx }}>
              <CalendarHeader sx={headerStyle}>
                <HeaderTitle sx={monthYearStyle}>
                  <HeaderText onClick={toggleMonthGrid}>
                    {months[currentDate.getMonth()]},
                  </HeaderText>
                  <HeaderText onClick={toggleYearGrid}>
                    {currentDate.getFullYear()}
                  </HeaderText>
                </HeaderTitle>
                <Box>
                  <StyledIconButton
                    onClick={handlePreviousClick}
                    disabled={showYearGrid ? yearOffset === 0 : false}
                    sx={navigationButtonStyle}
                  >
                    <ChevronLeftIcon />
                  </StyledIconButton>
                  <StyledIconButton
                    onClick={handleNextClick}
                    disabled={
                      showYearGrid
                        ? yearOffset + 12 >= yearRange.end - yearRange.start
                        : false
                    }
                    sx={navigationButtonStyle}
                  >
                    <ChevronRightIcon />
                  </StyledIconButton>
                </Box>
              </CalendarHeader>

              <CalendarContent>
                {showYearGrid ? (
                  <SelectionGrid sx={yearGridStyle}>
                    {getYearsToShow().map((year) => (
                      <SelectionCell
                        key={year}
                        isSelected={year === currentDate.getFullYear()}
                        onClick={() => handleYearClick(year)}
                        sx={{
                          ...dayStyle,
                          cursor:
                            year <= yearRange.end ? "pointer" : "not-allowed",
                          opacity: year <= yearRange.end ? 1 : 0.5,
                        }}
                      >
                        {year}
                      </SelectionCell>
                    ))}
                  </SelectionGrid>
                ) : showMonthGrid ? (
                  <SelectionGrid sx={monthGridStyle}>
                    {months.map((month, index) => (
                      <SelectionCell
                        key={month}
                        isSelected={index === currentDate.getMonth()}
                        onClick={() => handleMonthClick(index)}
                        sx={{
                          ...dayStyle,
                          backgroundColor:
                            index === currentDate.getMonth()
                              ? AQUA
                              : "transparent",
                          color:
                            index === currentDate.getMonth()
                              ? "#fff"
                              : DARK_PURPLE,
                        }}
                      >
                        {month.slice(0, 3)}
                      </SelectionCell>
                    ))}
                  </SelectionGrid>
                ) : (
                  <Box sx={{ height: "100%" }}>
                    <WeekDaysContainer>
                      {weekDays.map((day) => (
                        <WeekDay key={day} sx={weekDayStyle}>
                          {day}
                        </WeekDay>
                      ))}
                    </WeekDaysContainer>

                    <DaysGrid>
                      {getDaysInMonth(currentDate).map((dateObj, index) => {
                        const date = dateObj.isCurrentMonth
                          ? new Date(
                              currentDate.getFullYear(),
                              currentDate.getMonth(),
                              dateObj.day
                            )
                          : null;

                        const isDisabled = dateObj.isCurrentMonth
                          ? isDateDisabled(date)
                          : false;
                        const isHighlighted = dateObj.isCurrentMonth
                          ? isDateHighlighted(date)
                          : false;

                        return (
                          <DayCell
                            key={index}
                            isSelected={isSelected(dateObj.day)}
                            isToday={isToday(dateObj.day)}
                            isCurrentMonth={dateObj.isCurrentMonth}
                            onClick={() =>
                              dateObj.isCurrentMonth && !isDisabled &&
                              handleDateClick(
                                dateObj.day,
                                dateObj.isCurrentMonth
                              )
                            }
                            sx={{
                              ...dayStyle,
                              cursor: !dateObj.isCurrentMonth || isDisabled
                                ? "default"
                                : "pointer",
                              opacity: isDisabled ? 0.5 : 1,
                              textDecoration: isDisabled ? 'line-through' : 'none',
                            }}
                          >
                            {dateObj.day}
                          </DayCell>
                        );
                      })}
                    </DaysGrid>
                  </Box>
                )}
              </CalendarContent>
            </CalendarContainer>
          </CalendarModal>
        </ClickAwayListener>
      </Modal>
    </Box>
  );
};

export default NuralCalendar;



