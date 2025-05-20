export const formatIndianNumberSystem = (num) => {
  if (isNaN(num) || num === null || num === undefined) {
    return "0"; // Return "0" for invalid inputs
  }

  const absNum = Math.abs(num);
  let value;
  let suffix = '';

  if (absNum >= 10000000) { // Crores (1,00,00,000)
    value = num / 10000000;
    suffix = ' Cr';
  } else if (absNum >= 100000) { // Lakhs (1,00,000)
    value = num / 100000;
    suffix = ' L';
  } else if (absNum >= 1000) { // Thousands (1,000)
    value = num / 1000;
    suffix = ' K';
  } else {
    value = num;
  }

  // Format the base value with commas and appropriate decimal places
  let formattedValue;
  if (suffix) {
      // Keep 1-2 decimal places for abbreviated values
      formattedValue = value.toLocaleString('en-IN', { minimumFractionDigits: 1, maximumFractionDigits: 2 });
  } else {
      // Show the full number with commas if less than 1000
      formattedValue = value.toLocaleString('en-IN');
  }


  return formattedValue + suffix;
}; 