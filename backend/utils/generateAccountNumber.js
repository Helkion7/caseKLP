function generateAccountNumber() {
  const min = 1000000000; // 10 digits
  const max = 9999999999;
  const accountNumber = Math.floor(Math.random() * (max - min + 1)) + min;

  return accountNumber.toString();
}

module.exports = generateAccountNumber;
