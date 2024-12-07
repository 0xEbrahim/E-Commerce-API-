import { sendEmail } from "../config/sendEmail.js";
import { generateTemplate } from "../public/email.js";

export const sendEmailToken = async (user) => {
  const confirmToken = user.createEmailConfirmationToken();
  await user.save();
  const html = generateTemplate(confirmToken);
  const data = {
    email: user.email,
    subject: "Email confirmation",
    html,
  };
  await sendEmail(data);
};
