import React, { useState, useRef } from "react";
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
  fontWeight: isToday ? 600 : 400,
  backgroundColor: isToday ? AQUA : "transparent",
  color: !isCurrentMonth ? "transparent" : isToday ? "#fff" : DARK_PURPLE,
  visibility: isCurrentMonth ? "visible" : "hidden",
  "&:hover": {
    backgroundColor: isCurrentMonth
      ? isToday
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
  const [currentDate, setCurrentDate] = useState(initialDate || new Date());
  const [selectedDate, setSelectedDate] = useState(initialDate || new Date());
  const [showYearGrid, setShowYearGrid] = useState(false);
  const [showMonthGrid, setShowMonthGrid] = useState(false);
  const [yearOffset, setYearOffset] = useState(0);
  const [openCalendar, setOpenCalendar] = useState(false);
  const anchorRef = useRef(null);

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
    if (!date) return false;
    if (!disabledDates) return false;
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return disabledDates.some(
      (disabled) => disabled && date && disabled.getTime() === date.getTime()
    );
  };

  const isDateHighlighted = (date) => {
    if (!date || !highlightedDates) return false;
    return highlightedDates.some(
      (highlighted) =>
        highlighted && date && highlighted.getTime() === date.getTime()
    );
  };

  const handleYearClick = (year) => {
    // Allow selection up to the current year
    if (year <= yearRange.end) {
      const newDate = new Date(selectedDate.getTime());
      newDate.setFullYear(year);
      setCurrentDate(newDate);
      setSelectedDate(newDate);
      setShowYearGrid(false);
      onYearChange?.(newDate);
      onDateSelect?.(newDate);
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
      // Create date at start of day in local timezone
      const newDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day,
        12  // Set to noon to avoid timezone issues
      );
      setCurrentDate(newDate);
      setSelectedDate(newDate);
      onChange?.(newDate);
      setOpenCalendar(false);
    }
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
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
    
    let dateObj;
    if (typeof date === 'string') {
      // Parse string date and set to noon to avoid timezone issues
      dateObj = new Date(date);
      dateObj.setHours(12, 0, 0, 0);
    } else {
      dateObj = new Date(date);
      dateObj.setHours(12, 0, 0, 0);
    }

    if (isNaN(dateObj.getTime())) return "";

    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = dateObj.toLocaleString("en-US", { month: "short" });
    const year = dateObj.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const handleCalendarOpen = () => {
    setOpenCalendar(true);
  };

  const handleCalendarClose = () => {
    setOpenCalendar(false);
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
                            isSelected={false}
                            isToday={isToday(dateObj.day)}
                            isCurrentMonth={dateObj.isCurrentMonth}
                            onClick={() =>
                              dateObj.isCurrentMonth &&
                              handleDateClick(
                                dateObj.day,
                                dateObj.isCurrentMonth
                              )
                            }
                            sx={{
                              ...dayStyle,
                              cursor: !dateObj.isCurrentMonth
                                ? "default"
                                : "pointer",
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



