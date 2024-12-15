import { sendEmail } from "../config/sendEmail.js";
import { generateAccountDeactivatedTemplate } from "../public/templates.js";

export const sendDeactiveAccount = async (user) => {
  user.isActive = false;
  user.reactiveBefore = Date.now() + 30 * 24 * 60 * 60 * 1000;
  user.lastOnline = Date.now();
  await user.save();
  const html = generateAccountDeactivatedTemplate();
  const data = {
    email: user.email,
    subject: "Account deactivated",
    html,
  };
  await sendEmail(data);
};
