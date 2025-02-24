// bankAccountUtil.js
/**
 * Utility functions for generating a realistic Norwegian bank account number and corresponding IBAN.
 *
 * Norwegian bank account numbers consist of 11 digits where the last digit is a checksum.
 * The checksum is computed using the weights: [2, 3, 4, 5, 6, 7, 2, 3, 4, 5] for the first 10 digits.
 * If the computed check digit equals 10, the generated number is invalid and a new one is created.
 *
 * The Norwegian IBAN is structured as:
 *   "NO" + [2 IBAN check digits] + [11-digit bank account number]
 *
 * The IBAN check digits are calculated by:
 *  1. Rearranging the string as: accountNumber + "232400"
 *     (since N = 23 and O = 24, and "00" is a placeholder for the check digits)
 *  2. Computing the remainder modulo 97 on this large number.
 *  3. The check digits are then: 98 - (remainder)
 */

function generateBankAccountNumber() {
  while (true) {
    const digits = [];
    // Generate 10 random digits
    for (let i = 0; i < 10; i++) {
      digits.push(Math.floor(Math.random() * 10));
    }
    const weights = [2, 3, 4, 5, 6, 7, 2, 3, 4, 5];
    let sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += digits[i] * weights[i];
    }
    const remainder = sum % 11;
    let checkDigit = 11 - remainder;
    if (checkDigit === 11) {
      checkDigit = 0;
    }
    // If checkDigit equals 10, the number is invalid – try again.
    if (checkDigit === 10) {
      continue;
    }
    digits.push(checkDigit);
    return digits.join("");
  }
}

function computeMod97(numberStr) {
  // Compute mod 97 iteratively to handle large numbers without precision issues.
  let remainder = 0;
  for (let i = 0; i < numberStr.length; i++) {
    remainder = (remainder * 10 + parseInt(numberStr[i], 10)) % 97;
  }
  return remainder;
}

function generateIBAN(accountNumber) {
  // Rearrange for IBAN calculation: accountNumber + "232400"
  // "23" and "24" come from converting "N" and "O" (N = 23, O = 24)
  const rearranged = accountNumber + "232400";
  const modResult = computeMod97(rearranged);
  let checkDigits = 98 - modResult;
  checkDigits = checkDigits < 10 ? "0" + checkDigits : String(checkDigits);
  return "NO" + checkDigits + accountNumber;
}

function generateNorwegianBankAccount() {
  const accountNumber = generateBankAccountNumber();
  const iban = generateIBAN(accountNumber);
  return { accountNumber, iban };
}

module.exports = {
  generateBankAccountNumber,
  generateIBAN,
  generateNorwegianBankAccount,
};
