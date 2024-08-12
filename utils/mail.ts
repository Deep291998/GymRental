import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: process.env.NODE_ENV !== "development",
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
} as SMTPTransport.Options);

type SendEmailDto = {
  sender: Mail.Address;
  recipient: Mail.Address[];
  subject: string;
  html: string;
};

export const sendEmail = async (dto: SendEmailDto) => {
  const { sender, recipient, subject, html } = dto;

  return await transporter.sendMail({
    from: sender,
    to: recipient,
    subject,
    html,
  });
};
