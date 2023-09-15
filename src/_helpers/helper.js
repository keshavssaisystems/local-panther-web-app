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
