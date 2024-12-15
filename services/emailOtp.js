import { sendEmail } from "../utils/email.js";

export const sendOtpEmail = async (otpCode, recipientEmail) => {
  const subject = "Mã OTP Xác Thực Để Đổi Mật Khẩu";
  let emailContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OTP Verification</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f9fafb;
      margin: 0;
      padding: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .email-container {
      background-color: #ffffff;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      max-width: 500px;
      width: 100%;
      text-align: center;
      line-height: 1.6;
      color: #333333;
    }
    .email-container h2 {
      margin-bottom: 10px;
      font-size: 24px;
      color: #111827;
    }
    .email-container p {
      margin: 5px 0;
      font-size: 14px;
      color: #6b7280;
    }
    .otp-code {
      margin: 20px 0;
      font-size: 36px;
      font-weight: bold;
      color: #1d4ed8;
      background-color: #f3f4f6;
      padding: 15px;
      border-radius: 8px;
      letter-spacing: 2px;
    }
    .email-container a {
      color: #1d4ed8;
      text-decoration: none;
      font-weight: bold;
    }
    .email-container a:hover {
      text-decoration: underline;
    }
    .footer {
      margin-top: 20px;
      font-size: 12px;
      color: #9ca3af;
    }
  </style>
</head>
<body>
  <div class="email-container">
  <h2>Mã OTP</h2>
  <p>Dùng mã dưới đây để xác thực (hết hạn sau <strong>60 giây</strong>). 
  <a href="http://localhost:5173/forgot-password/verify-otp">Xác thực ngay</a>.</p>
    <div class="otp-code">
      ${otpCode}
    </div>
    <div class="footer">
      <p>Nếu bạn không yêu cầu mà nhận được email này, xin hãy bỏ qua.</p>
      <p>Để được hỗ trợ, vui lòng truy cập <a href="#">trang hỗ trợ</a>.</p>
    </div>
  </div>
</body>
</html>
  `;
  return sendEmail(recipientEmail, subject, "", emailContent);
};
