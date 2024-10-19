export const template_2 = ({ otp, fullName }: { fullName: string, otp: string }) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    .email-container {
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 10px;
      background-color: #f9f9f9;
    }
    .header {
      text-align: center;
      background-color: #4CAF50;
      color: white;
      padding: 10px;
      border-radius: 10px 10px 0 0;
    }
    .body {
      margin-top: 20px;
      color: #333;
      line-height: 1.5;
    }
    .otp {
      font-size: 24px;
      font-weight: bold;
      color: #4CAF50;
      margin: 10px 0;
      text-align: center;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #777;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>OTP Verification</h1>
    </div>
    <div class="body">
      <p>Hi ${fullName},</p>
      <p>We received a request to verify your account. Please use the following OTP to complete the process:</p>
      <div class="otp">${otp}</div>
      <p>Please note that this OTP is valid for 10 minutes. If you did not request this verification, please ignore this email.</p>
    </div>
    <div class="footer">
      <p>If you have any questions, feel free to contact our support team.</p>
      <p>Thank you!</p>
    </div>
  </div>
</body>
</html>
`