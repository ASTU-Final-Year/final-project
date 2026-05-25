// src/lib/date-utils.js

// Ethiopian calendar offset (based on the bash script)
// The offset represents the difference between Gregorian and Ethiopian epochs
const ETHIOPIAN_OFFSET_SECONDS = 242892000; // ~7.7 years in seconds

/**
 * Convert Gregorian date to Ethiopian date (for DISPLAY only)
 * @param {Date} date - Gregorian date
 * @returns {Object} Ethiopian date components
 */
export function gregorianToEthiopian(date) {
  const gregDate = new Date(date);
  
  // Apply Julian offset to get Ethiopian time
  const julianTimestamp = gregDate.getTime() - (ETHIOPIAN_OFFSET_SECONDS * 1000);
  const julianDate = new Date(julianTimestamp);
  
  // Calculate day of year in Ethiopian calendar
  const startOfYear = new Date(julianDate.getFullYear(), 0, 0);
  const dayOfYear = Math.round((julianDate - startOfYear) / (1000 * 60 * 60 * 24));
  
  // Ethiopian months are 30 days each, with the 13th month (Pagume) having 5 or 6 days
  let ethMonth = Math.floor(dayOfYear / 30) + 1;
  let ethDay = (dayOfYear % 30) + 1;
  let ethYear = julianDate.getFullYear();
  
  // Handle Pagume (13th month)
  if (ethMonth > 13) {
    ethMonth = 13;
    ethDay = dayOfYear - 360 + 1;
  }
  
  // Adjust for Ethiopian leap year
  const isEthiopianLeapYear = (ethYear + 1) % 4 === 0;
  if (ethMonth === 13 && ethDay > (isEthiopianLeapYear ? 6 : 5)) {
    ethMonth = 1;
    ethDay = ethDay - (isEthiopianLeapYear ? 6 : 5);
    ethYear++;
  }
  
  return {
    year: ethYear,
    month: ethMonth,
    date: ethDay,
    day: gregDate.getDay(),
    hour: gregDate.getHours(),
    minute: gregDate.getMinutes(),
  };
}

/**
 * Get Ethiopian month name
 */
export function getEthiopianMonthName(month, language = "en") {
  const months = {
    am: [
      "መስከረም", "ጥቅምት", "ህዳር", "ታህሳስ", "ጥር", "የካቲት",
      "መጋቢት", "ሚያዚያ", "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜ"
    ],
    en: [
      "Meskerem", "Tikimt", "Hidar", "Tahsas", "Tir", "Yekatit",
      "Megabit", "Miazia", "Genbot", "Sene", "Hamle", "Nehasse", "Pagume"
    ],
  };
  return months[language]?.[month - 1] || months.en[month - 1];
}

/**
 * Get Ethiopian day name
 */
export function getEthiopianDayName(dayIndex, language = "en") {
  const days = {
    am: ["እሑድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "አርብ", "ቅዳሜ"],
    en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  };
  return days[language]?.[dayIndex] || days.en[dayIndex];
}

export const ethiopianMonthNames = {
  am: [
    "መስከረም", "ጥቅምት", "ህዳር", "ታህሳስ", "ጥር", "የካቲት",
    "መጋቢት", "ሚያዚያ", "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜ"
  ],
  en: [
    "Meskerem", "Tikimt", "Hidar", "Tahsas", "Tir", "Yekatit",
    "Megabit", "Miazia", "Genbot", "Sene", "Hamle", "Nehasse", "Pagume"
  ],
};

export const ethiopianDays = {
  am: ["ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "አርብ", "ቅዳሜ", "እሑድ"],
  en: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
};

/**
 * Get Ethiopian days short format
 */
export const ethiopianShortDays = {
  am: ["እሑድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "አርብ", "ቅዳሜ"],
  en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
};

/**
 * Get Ethiopian time period
 */
export function getEthiopianTimePeriod(hours) {
  return hours < 12 ? "ከጠዋቱ" : "ከሰዓቱ";
}

/**
 * Format Ethiopian date for display (converts from Gregorian input)
 */
export function formatEthiopianDate(gregorianDate, language = "en") {
  const eth = gregorianToEthiopian(gregorianDate);
  const monthName = getEthiopianMonthName(eth.month, language);
  if (language === "am") {
    return `${monthName} ${eth.date}፣ ${eth.year}`;
  }
  return `${monthName} ${eth.date}, ${eth.year}`;
}

/**
 * Format Ethiopian date with time (converts from Gregorian input)
 */
export function formatEthiopianDateTime(gregorianDate, language = "en") {
  const eth = gregorianToEthiopian(gregorianDate);
  const monthName = getEthiopianMonthName(eth.month, language);
  const timePeriod = getEthiopianTimePeriod(eth.hour);
  const hour12 = eth.hour % 12 || 12;
  const minute = eth.minute.toString().padStart(2, "0");
  
  if (language === "am") {
    return `${timePeriod} ${hour12}:${minute} | ${monthName} ${eth.date} | ${eth.year}`;
  }
  return `${hour12}:${minute} ${timePeriod === "ከጠዋቱ" ? "AM" : "PM"} | ${monthName} ${eth.date}, ${eth.year}`;
}

/**
 * Format date based on selected calendar mode
 */
export function formatDate(date, calendarMode = "gregorian", language = "en") {
  if (calendarMode === "ethiopian") {
    return formatEthiopianDate(date, language);
  }
  return date.toLocaleDateString(language === "am" ? "am-ET" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format time based on selected calendar mode
 */
export function formatTime(date, calendarMode = "gregorian", language = "en") {
  if (calendarMode === "ethiopian") {
    const eth = gregorianToEthiopian(date);
    const timePeriod = getEthiopianTimePeriod(eth.hour);
    const hour12 = eth.hour % 12 || 12;
    const minute = eth.minute.toString().padStart(2, "0");
    
    if (language === "am") {
      return `${timePeriod} ${hour12}:${minute}`;
    }
    return `${hour12}:${minute} ${timePeriod === "ከጠዋቱ" ? "AM" : "PM"}`;
  }
  return date.toLocaleTimeString(language === "am" ? "am-ET" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}