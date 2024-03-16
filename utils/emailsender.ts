import nodemailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";

let {
  SMTP_HOST,
  SENDER_EMAIL,
  SENDER_USERNAME,
  SENDER_PASSWORD,
  IS_GOOGLE,
  IS_SECURE,
  SMTP_PORT,
} = process.env;

if (typeof SENDER_USERNAME === "undefined") {
  SENDER_USERNAME = SENDER_EMAIL;
}

class MailSender {
  transporter: nodemailer.Transporter;

  constructor() {
    let nodemailerOptions = {
      host: SMTP_HOST,
      auth: {
        user: SENDER_EMAIL,
        pass: SENDER_PASSWORD,
      },
    };
    if (IS_GOOGLE) nodemailerOptions["service"] = "gmail";
    if (IS_SECURE) nodemailerOptions["secure"] = IS_SECURE;
    if (SMTP_PORT) nodemailerOptions["port"] = SMTP_PORT;

    this.transporter = nodemailer.createTransport(
      smtpTransport(nodemailerOptions)
    );
  }

  async sendEmail(toEmail, code, name, emailNotify, callback) {
    const mailOptions = {
      from: '"Email Verification Bot ✉️" <' + SENDER_EMAIL + ">",
      to: toEmail,
      subject: name + " Discord Email Verification",
      text: `Use this code ${code} to have yourself verified on the server`,
    };

    if (!IS_GOOGLE) mailOptions["bcc"] = SENDER_EMAIL;

    this.transporter.sendMail(mailOptions, async (error, info) => {
      if (error || info.rejected.length > 0) {
        if (emailNotify) {
          console.log(error);
        }
        throw "Could not send mail";
      } else {
        callback(info.accepted[0]);
        if (emailNotify) {
          console.log("Email sent to: " + toEmail + ", Info: " + info.response);
        }
      }
    });
  }
}

const mailsender = new MailSender();

export default mailsender;
