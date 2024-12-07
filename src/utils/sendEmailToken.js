import { sendEmail } from "../config/sendEmail.js";
import { generateEmailTemplate } from "../public/templates.js";

export const sendEmailToken = async (user) => {
  const confirmToken = user.createEmailConfirmationToken();
  await user.save();
  const html = generateEmailTemplate(confirmToken);
  const data = {
    email: user.email,
    subject: "Email confirmation",
    html,
  };
  await sendEmail(data);
};
