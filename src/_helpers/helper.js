import moment from "moment-timezone";

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
  let today = `${today_month} ${today_year}`;

  // Create the formatted date string
  const formattedDate = `${month} ${year}`;

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

export function calculateExperience(fromDate, toDate) {
  let fromDateObj = new Date(fromDate);
  let toDateObj = toDate ? new Date(toDate) : new Date();

  let yearDifference = toDateObj.getFullYear() - fromDateObj.getFullYear();
  let monthDifference = toDateObj.getMonth() - fromDateObj.getMonth();

  let yearsText =
    yearDifference > 0
      ? `${yearDifference} ${yearDifference === 1 ? "year" : "years"}`
      : "";
  let monthsText =
    monthDifference > 0
      ? `${monthDifference} ${monthDifference === 1 ? "month" : "months"}`
      : "";

  let experienceText;
  if (monthsText != "" && yearsText != "") {
    experienceText = [yearsText, monthsText].filter(Boolean).join(", ");
  } else if (yearsText != "" || monthsText != "") {
    experienceText = [yearsText, monthsText].filter(Boolean).join("");
  }
  if (monthsText == "" && yearsText == "") {
    experienceText = "";
  }
  if (experienceText != "") {
    experienceText = `(${experienceText})`;
  }

  return experienceText;
}

export const getDate = function (data) {
  let text = "";
  if (data.startdate) {
    text = formatDate(data.startdate);

    if (data.enddate) {
      text += " to " + formatDateQualification(data.enddate);
    }
  } else if (data.enddate) {
    text = formatDateQualification(data.enddate);
  }
  return text;
};

export const getEducText = function (data) {
  let text = "";
  if (data.school != "") {
    text = data.school;
    if (data.cityname != "") {
      text += ", " + data.cityname;
    }
    if (data.statename != "") {
      text += ", " + data.statename;
    }
    if (data.countryname != "") {
      text += ", " + data.countryname;
    }
  } else if (data.cityname != "") {
    text = data.cityname;
    if (data.statename != "") {
      text += ", " + data.statename;
    }
    if (data.countryname != "") {
      text += ", " + data.countryname;
    }
  } else if (data.statename != "") {
    text = data.statename;
    if (data.countryname != "") {
      text += ", " + data.countryname;
    }
  } else if (data.countryname != "") {
    text = data.countryname;
    text += data.countryname;
  }

  return text;
};
export const convertText = function (htmlContent) {
  let data;
  const lines = htmlContent?.split("<p>").map((line, index) => {
    if (index === 0) {
      data = "";
    } else {
      data += `<li>${line?.replace("</p>", "")}</li>`;
    }
  });
  if (data != "") {
    return data;
  } else {
    return data;
  }
};

export const getLocationText = function (data) {
  let text = "";
  if (data.cityname !== "") {
    text = data.cityname;
    if (data.statename !== "") {
      text += ", " + data.statename;
    }
    if (data.countryname !== "") {
      text += ", " + data.countryname;
    }
  } else if (data.statename !== "") {
    text = data.statename;
    if (data.countryname !== "") {
      text += ", " + data.countryname;
    }
  } else if (data.countryname !== "") {
    text = data.countryname;
    text += data.countryname;
  }
  return text;
};

export function convertDateToYYYMMDD(dateStr) {
  if (dateStr.month == "" && dateStr.year == "") {
    return null;
  }

  const monthStr = dateStr.month == "" ? "January" : dateStr.month;
  const yearStr = dateStr.year == "" ? new Date().getFullYear() : dateStr.year;

  // Convert the month string to a number (1-12)
  const month = new Date(Date.parse(monthStr + " 1, 2000")).getMonth() + 1;

  // Create a date string in "YYYY-MM-DD" format
  const formattedDate = `${yearStr}-${month.toString().padStart(2, "0")}-01`;

  return formattedDate;
}

export const USPhoneNumber = function (inputValue) {
  if (inputValue.length === 10) {
    let USNumber = inputValue.match(/(\d{3})(\d{3})(\d{4})/);
    return "(" + USNumber[1] + ")-" + USNumber[2] + "-" + USNumber[3];
  } else {
    return inputValue;
  }
};

export const updateMonthstoYears = (months) => {
  if (months === 0) {
    return " ";
  } else {
    return months % 12 === 0
      ? ((months / 12) | 0) + (months / 12 === 1 ? " year" : " years")
      : ((months / 12) | 0) + " years and " + (months % 12) + " months";
  }
};

export const getTimezoneDateTime = (
  dateTime,
  format = "MM/DD/YYYY hh:mm a"
) => {
  const systemTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return moment.utc(dateTime).tz(systemTimeZone).format(format);
};
export const getTimezoneDateTimeForNow = (dateTime, format) => {
  const systemTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return moment.utc(dateTime).tz(systemTimeZone).fromNow();
};
export function convertTo12HourFormat(time24) {
  // Split the time string into hours and minutes
  const [hours, minutes] = time24.split(":");

  // Create a new Date object with the given hours and minutes
  const date = new Date(0, 0, 0, hours, minutes);

  // Format the time in 12-hour format
  const options = { hour: "numeric", minute: "numeric", hour12: true };
  const time12 = date.toLocaleTimeString([], options);

  return time12;
}
export function calculateEndTime(startTime, duration) {
  // Parse the start time and duration
  const [hours, minutes, seconds] = startTime.split(":").map(Number);
  const [durationValue, durationUnit] = duration.split(" ");
  const durationInMinutes = parseInt(durationValue);

  // Calculate the end time in minutes
  let totalMinutes = hours * 60 + minutes + durationInMinutes;

  // Calculate the new hours and minutes
  const newHours = Math.floor(totalMinutes / 60);
  const newMinutes = totalMinutes % 60;

  // Convert to 12-hour format
  const amPm = newHours >= 12 ? "PM" : "AM";
  const formattedHours = newHours % 12 || 12; // Handle midnight (0) as 12 AM

  // Format the end time as "hh:mm:ss AM/PM"
  const endTime = `${String(formattedHours).padStart(2, "0")}:${String(
    newMinutes
  ).padStart(2, "0")} ${amPm}`;

  return endTime;
}

export function checkDateValidation(data) {
  if (
    data.toDateSelect.year !== "" &&
    data.toDateSelect.month !== "" &&
    data.fromDateSelect.month !== "" &&
    data.fromDateSelect.year !== ""
  ) {
    let fromDate = convertDateToYYYMMDD(data.fromDateSelect);
    let toDate = convertDateToYYYMMDD(data.toDateSelect);

    if (new Date(fromDate) <= new Date(toDate)) {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
}

export const getChannelId = (id1, id2, scheduleid) => {
  return id1 < id2
    ? id1 + "" + id2 + "" + scheduleid
    : id2 + "" + id1 + "" + scheduleid;
};

export const getVideoChannelId = (jobid, scheduleinterviewid, candidateid) => {
  return scheduleinterviewid + "-" + jobid + "-" + candidateid;
};

export const getBasePayMask = (basePayValue) => {
  let removeCommas = basePayValue.replace(/,/g, "");
  if (removeCommas.length < 3) {
    return "999";
  }
  if (removeCommas.length === 4) {
    return "9,999";
  }
  if (removeCommas.length === 5) {
    return "99,999";
  }
  if (removeCommas.length === 6) {
    return "999,999";
  }
  if (removeCommas.length === 7) {
    return "9,999,999";
  }
  if (removeCommas.length === 8) {
    return "99,999,999";
  }
  if (removeCommas.length === 9) {
    return "999,999,999";
  }
};
