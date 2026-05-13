const yearDiff = 8 * 365.25 * 24 * 60 * 60 * 1000;
const monthDiff = (2 * 30 + 2 * 31 - 7) * 24 * 60 * 60 * 1000;
const timeDiff = 6 * 60 * 60 * 1000;
const dateDiff = yearDiff - monthDiff + timeDiff;

function gregorianToJulian(date) {
  const julianTime = new Date(date.getTime() - dateDiff);
  return julianTime;
}

function julianToGregorian(date) {
  const julianTime = new Date(date.getTime() + dateDiff);
  return julianTime;
}
