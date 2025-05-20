/**
 * Transforms raw sales data into a format suitable for graph display
 * @param {Array} inputData - Raw data array from API
 * @param {string} period - Period type ('day', 'week', 'month', 'year')
 * @returns {Array} Transformed data array
 */
export const transformGraphData = (inputData, period) => {
  if (!inputData || !Array.isArray(inputData)) return [];

  return inputData.map(item => {
    if (!item) return null;

    try {
      switch (period) {
        case "day":
          return {
            date: item.saleDate || "",
            sale: item.daySale || 0,
            quantity: item.dayQuantity || 0,
            asp: item.dayASP || 0
          };
        case "week":
          return {
            date: item.weekNo ? `Week ${item.weekNo}` : "",
            dateRange: item.weekStartDate && item.weekEndDate ? 
              `${item.weekStartDate} - ${item.weekEndDate}` : "",
            sale: item.weekSale || 0,
            quantity: item.weekQuantity || 0,
            asp: item.weekASP || 0
          };
        case "month":
          return {
            date: item.monthName || "",
            dateRange: item.monthStartDate && item.monthEndDate ? 
              `${item.monthStartDate} - ${item.monthEndDate}` : "",
            sale: item.monthSale || 0,
            quantity: item.monthQuantity || 0,
            asp: item.monthASP || 0
          };
        case "year":
          return {
            date: item.year ? item.year.toString() : "",
            dateRange: item.yearStartDate && item.yearEndDate ? 
              `${item.yearStartDate} - ${item.yearEndDate}` : "",
            sale: item.yearSale || 0,
            quantity: item.yearQuantity || 0,
            asp: item.yearASP || 0
          };
        default:
          return {
            date: "",
            sale: 0,
            quantity: 0,
            asp: 0
          };
      }
    } catch (error) {
      console.error("Error transforming data:", error);
      return {
        date: "",
        sale: 0,
        quantity: 0,
        asp: 0
      };
    }
  }).filter(item => item && item.date); // Remove null items and items without dates
};

/**
 * Formats numeric values into currency format with appropriate units
 * @param {number} value - Numeric value to format
 * @returns {string} Formatted value with currency symbol and unit
 */
export const formatCurrencyValue = (value) => {
  if (!value && value !== 0) return "₹0";
  
  try {
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)}Cr`;
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)}L`;
    } else if (value >= 1000) {
      return `₹${(value / 1000).toFixed(2)}K`;
    }
    return `₹${value}`;
  } catch (error) {
    console.error("Error formatting value:", error);
    return "₹0";
  }
}; 