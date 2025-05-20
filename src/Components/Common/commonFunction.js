import { LIGHT_GRAY2, PRIMARY_BLUE2 } from "./colors";

export const getCurrentMonthFirstDate = () => {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), 1, 12, 0, 0, 0); // First day of current month at noon
};

export const getTodayDate = () => {
  const today = new Date();
  return new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    12,
    0,
    0,
    0
  ); // Today at noon
};

export const scrollToTableMiddle = () => {
  if (tableContainerRef.current) {
    const rowHeight = 53; // Approximate height of each table row
    const headerHeight = 100; // Approximate height of table header
    const scrollPosition = headerHeight + rowHeight * 1;
    tableContainerRef.current.scrollTo({
      top: scrollPosition,
      behavior: "smooth",
    });
  }
};

export const scrollToTop = () => {
  setTimeout(() => {
    const createAccordion = document.getElementById("create-accordion");
    if (createAccordion) {
      createAccordion.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, 100);
};

export const transformData = (inputData, period, caseType) => {
  if (!inputData || !Array.isArray(inputData)) return [];

  return inputData
    .map((item) => {
      if (!item) return null;

      try {
        switch (period && caseType) {
          case "day" && caseType == "":
            return {
              date: item.saleDate || "",
              sale: item.daySale || 0,
              quantity: item.dayQuantity || 0,
              // asp: item.dayASP || 0,
            };
          case "week" && caseType == "":
            return {
              date: item.weekNo ? `Week ${item.weekNo}` : "",
              dateRange:
                item.weekStartDate && item.weekEndDate
                  ? `${item.weekStartDate} - ${item.weekEndDate}`
                  : "",
              sale: item.weekSale || 0,
              quantity: item.weekQuantity || 0,
              // asp: item.weekASP || 0,
            };
          case "month" && caseType == "":
            return {
              date: item.monthName || "",
              dateRange:
                item.monthStartDate && item.monthEndDate
                  ? `${item.monthStartDate} - ${item.monthEndDate}`
                  : "",
              sale: item.monthSale || 0,
              quantity: item.monthQuantity || 0,
              // asp: item.monthASP || 0,
            };
          case "year" && caseType == "":
            return {
              date: item.year ? item.year.toString() : "",
              dateRange:
                item.yearStartDate && item.yearEndDate
                  ? `${item.yearStartDate} - ${item.yearEndDate}`
                  : "",
              sale: item.yearSale || 0,
              quantity: item.yearQuantity || 0,
              // asp: item.yearASP || 0,
            };

          case "week" && caseType == "asp":
            return {
              date: item.weekNo ? `Week ${item.weekNo}` : "",
              dateRange:
                item.weekStartDate && item.weekEndDate
                  ? `${item.weekStartDate} - ${item.weekEndDate}`
                  : "",
              // sale: item.weekSale || 0,
              quantity: item.weekQuantity || 0,
              asp: item.weekASP || 0,
            };

          default:
            return {
              date: "",
              sale: 0,
              quantity: 0,
              asp: 0,
            };
        }
      } catch (error) {
        console.error("Error transforming data:", error);
        return {
          date: "",
          sale: 0,
          quantity: 0,
          asp: 0,
        };
      }
    })
    .filter((item) => item && item.date); // Remove null items and items without dates
};

export const formatDate = (date) => {
  const options = { year: "numeric", month: "short", day: "numeric" };
  const parts = new Intl.DateTimeFormat("en-US", options).formatToParts(date);

  let day = "";
  let month = "";
  let year = "";

  parts.forEach((part) => {
    if (part.type === "day") day = part.value;
    if (part.type === "month") month = part.value.toUpperCase();
    if (part.type === "year") year = part.value;
  });

  return `${month} ${day}, ${year}`;
};

export const getTodaysDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getFirstDayOfMonth = () => {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  return firstDay.toISOString();
};

export const getToday = () => {
  return new Date().toISOString();
};

export const listStyle = {
  fontFamily: "Manrope",
  fontWeight: 700,
  fontSize: "14px",
  lineHeight: "19.12px",
  letterSpacing: "0%",
  color: PRIMARY_BLUE2,
  p: 1,
};

export const detailLabelCellStyle = {
  fontWeight: "bold",
  color: "#555",
  backgroundColor: LIGHT_GRAY2,
  padding: "8px 12px",
  border: "1px solid #ddd",
  fontSize: "12px",
  width: "30%",
};

export const detailValueCellStyle = {
  color: "#333",
  backgroundColor: LIGHT_GRAY2,

  padding: "8px 12px",
  border: "1px solid #ddd",
  fontSize: "12px",
  width: "70%",
};
