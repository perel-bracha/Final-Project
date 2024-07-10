function isValidIsraeliID(id) {
  // בדיקת מספר תעודת זהות ישראלי
  const idPattern = /^\d{9}$/; // מספר תעודת זהות באורך 9 ספרות בלבד

  if (!idPattern.test(id)) {
    return false;
  }

  // בדיקת ספרת הביקורת
  const idDigits = id.split("").map(Number);
  const checksum = idDigits.reduce((acc, digit, index) => {
    const weight = index % 2 === 0 ? 1 : 2;
    const sum = digit * weight;
    return acc + (sum > 9 ? sum - 9 : sum);
  }, 0);

  return checksum % 10 === 0;
}
module.exports = isValidIsraeliID;
