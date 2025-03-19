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