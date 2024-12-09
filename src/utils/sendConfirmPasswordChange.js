import { sendEmail } from "../config/sendEmail.js";
import { generatechangePasswordConfirmTemplate } from "../public/templates.js";

export const sendConfirmPasswordChangeToken = async (user) => {
  await user.createPasswordResetToken();
  await user.save();
  const html = generatechangePasswordConfirmTemplate(user.email);
  const data = {
    email: user.email,
    subject: "Confirm Password Change",
    html,
  };
  await sendEmail(data);
};
