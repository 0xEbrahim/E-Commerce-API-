import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendEmail = async (data) => {
  const emailInfo = {
    from: '"Ebrahim El-Sayed" <maddison53@ethereal.email>',
    to: data.email,
    subject: data.subject, // Subject line
    text: data.text, // plain text body
    // html: "<b>Hello world?</b>", // html body
  };
  const info = await transporter.sendMail(emailInfo);
  console.log("Message sent: %s", info.messageId);
};
