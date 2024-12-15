import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const { EMAIL_TEST, PASS_TEST } = process.env;

export const sendEmail = async (email, subject, text, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_TEST,
        pass: PASS_TEST,
      },
    });

    const mailOptions = {
      from: EMAIL_TEST,
      to: email,
      subject: subject,
      text: text,
      html: html,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    return null;
  }
};
