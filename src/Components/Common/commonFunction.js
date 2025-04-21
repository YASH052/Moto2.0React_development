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
    const createAccordion = document.getElementById('create-accordion');
    if (createAccordion) {
      createAccordion.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, 100);
};

