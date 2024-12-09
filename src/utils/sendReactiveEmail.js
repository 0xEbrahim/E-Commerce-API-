import { sendEmail } from "../config/sendEmail.js";
import { generateReactivateAccountTemplate } from "../public/templates.js";

export const sendReactiveAccount = async (user) => {
  user.isActive = true;
  user.reactiveBefore = undefined;
//   user.lastOnline = Date.now();
  await user.save();
  const html = generateReactivateAccountTemplate();
  const data = {
    email: user.email,
    subject: "Account reactivated",
    html,
  };
  await sendEmail(data);
};
