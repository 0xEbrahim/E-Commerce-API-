import { sendEmail } from "../config/sendEmail.js";
import { generatePasswordTemplate } from "../public/templates.js";

export const sendPasswordToken = async (user) => {
  const confirmToken = user.createPasswordResetToken();
  await user.save();
  const html = generatePasswordTemplate(confirmToken);
  const data = {
    email: user.email,
    subject: "Password reset",
    html,
  };
  await sendEmail(data);
};
