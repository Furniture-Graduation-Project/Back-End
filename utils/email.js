import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const { EMAIL_USERNAME, EMAIL_PASSWORD } = process.env;

export const sendEmail = async (email, subject, text, html) => {
  try {
    const emailStyles = fs.readFileSync('assets/email.css', 'utf8');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: EMAIL_USERNAME,
      to: email,
      subject: subject,
      text: text,
      html: `
        <!DOCTYPE html>
        <html>
       <head>
        <style>
        ${emailStyles}
       </style>
        </head>
      <body>
      <div class="email-container">
        <div class="email-header">
            <img src="https://res.cloudinary.com/dfykg7wtt/image/upload/v1734279997/test/ykvtz6z4zmrs0dcuxv6p.png"
                alt="Company Logo">
            <h1>Nội Thất River <span>🎄</span></h1>
        </div>
        <div class="email-body">
            ${html}
        </div>
        <div class="email-footer">
            <p>Trân trọng,</p>
            <h2>Nội Thất River</h2>
            <p>Hotline: ${process.env.ACCOUNT_NO}</p>
            <p>Website: <a href="${process.env.CLIENT_URL}" class="link">${process.env.CLIENT_URL}</a></p>
        </div>
    </div>
    </body>
    </html>
      `,
    };
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.log(error);
    return null;
  }
};
