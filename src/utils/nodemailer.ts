import { createTransport } from "nodemailer";

export const sendOTPtoMail = async (otp: number, recipient: string) => {
  try {
    const user = process.env.NODEMAILER_EMAIL;
    const pass = process.env.NODEMAILER_PASSWORD;

    const messageBody = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f4f4f7;
      margin: 0;
      padding: 0;
      line-height: 1.4;
    }
    .email-container {
      background-color: #ffffff;
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
    }
    .header {
      text-align: center;
      background-color: #F67A27;
      padding: 20px;
      border-radius: 8px 8px 0 0;
      color: #fff;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 20px;
    }
    .content h2 {
      color: #333;
      font-size: 22px;
      text-align: center;
    }
    .content p {
      font-size: 16px;
      color: #555;
      text-align: center;
    }
    .otp {
      background-color: #F67A27;
      color: #fff;
      font-size: 20px;
      font-weight: bold;
      text-align: center;
      padding: 10px;
      border-radius: 4px;
      width: fit-content;
      margin: 10px auto; 
    }
    .footer {
      margin-top: 20px;
      text-align: center;
      font-size: 12px;
      color: #999;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Password Reset</h1>
    </div>
    <div class="content">
      <h2>Reset Your Password</h2>
      <p>We received a request to reset your password. Use the OTP below to proceed:</p>
      <div class="otp">${otp}</div>
      <p>If you didn’t request a password reset, please ignore this email.</p>
    </div>
    <div class="footer">
      <p>&copy; 2024 Afro Tango. All Rights Reserved.</p>
    </div>
  </div>
</body>
</html>
`;

    const transporter = createTransport({
      service: "gmail",
      auth: {
        user,
        pass,
      },
    });

    const mailOptions = {
      from: "Afro Tango",
      to: recipient,
      subject: "One Time Password",
      html: messageBody,
    };

    return transporter.sendMail(mailOptions);
  } catch (error) {
    console.error(error);
  }
};
