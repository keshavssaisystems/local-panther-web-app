export const applyMask = function (inputValue) {
  const numCharsToMask = inputValue.length - (inputValue.length - 2);
  const maskedValue =
    "*".repeat(inputValue.length - numCharsToMask) +
    inputValue.slice(-numCharsToMask);

  return maskedValue;
};
export const formatPhoneNumber = function (inputValue) {
  const maskedValue = "*".repeat(10 - 4) + inputValue.slice(-4);
  return `(${maskedValue.substring(0, 3)}) - ${maskedValue.substring(
    3,
    6
  )} - ${maskedValue.substring(6)}`;
};

export const maskEmail = function (inputValue) {
  const username = inputValue.substring(0, inputValue.indexOf("@"));
  const maskedUsername = "*".repeat(username.length);
  const maskedValue =
    maskedUsername + inputValue.substring(inputValue.indexOf("@"));

  return maskedValue;
};

export const getApplicationDate = function (date) {
  const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
  const today = new Date();
  const appliedDate = new Date(date);
  let istoday;
  if (today === appliedDate) {
    istoday = true;
  }
  const diffDays = Math.round(Math.abs((today - appliedDate) / oneDay));
  let daysMsg =
    "Applied " +
    (istoday
      ? " Today"
      : Number(diffDays) === 1
      ? +diffDays + " day ago"
      : diffDays + " days ago");

  return daysMsg;
};
export const formatDate = function (dateString) {
  // Parse the input date string

  if (!dateString) {
    return;
  }

  const date = new Date(dateString);

  // Define month names as an array
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Get the month, day, and year components
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  // Create the formatted date string
  const formattedDate = `${month} ${day}, ${year}`;

  return formattedDate;
};
export const formatDateQualification = function (dateString) {
  // Parse the input date string

  if (!dateString) {
    return;
  }

  const date = new Date(dateString);

  // Define month names as an array
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Get the month, day, and year components
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  const today_month = monthNames[new Date().getMonth()];
  const today_day = new Date().getDate();
  const today_year = new Date().getFullYear();
  let today = `${today_month} ${today_day}, ${today_year}`;

  // Create the formatted date string
  const formattedDate = `${month} ${day}, ${year}`;

  if (today == formattedDate) {
    return "Present";
  } else {
    return formattedDate;
  }
};
export const extractDatePart = function (inputDate) {
  const dateObj = new Date(inputDate);

  // Extract the year, month, and day components
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Month is zero-based
  const day = String(dateObj.getDate()).padStart(2, "0");

  // Format as "yyyy-mm-dd"
  const formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
};

export const formatMonthYear = function (dateString) {
  // Parse the input date string

  if (!dateString) {
    return;
  }

  const date = new Date(dateString);

  // Define month names as an array
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Get the month, day, and year components
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  // Create the formatted date string
  const formattedDate = `${month} ${year}`;

  return formattedDate;
};

export const endDateValidation = function (dateString) {
  // Parse the input date string

  if (!dateString) {
    return;
  }

  const date = new Date(dateString);

  // Define month names as an array
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Get the month, day, and year components
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  const today_month = monthNames[new Date().getMonth()];
  const today_year = new Date().getFullYear();
  let today = `${today_month} ${today_year}`;

  // Create the formatted date string
  const formattedDate = `${month} ${year}`;

  if (today == formattedDate) {
    return "Present";
  } else {
    return formattedDate;
  }
};
