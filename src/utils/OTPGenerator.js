const generateOTP = () => {
  const digits = '0123456789';
  const otpLength = 6;
  let otp = '';
  for (let i = 1; i <= otpLength; i += 1) {
    const index = Math.floor(Math.random() * digits.length);
    otp += digits[index];
  }

  return otp;
};

module.exports = generateOTP;
