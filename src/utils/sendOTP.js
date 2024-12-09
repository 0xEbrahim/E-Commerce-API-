import { sendEmail } from "../config/sendEmail.js";
import { generateTwoStepAuthTemplate } from "../public/templates.js";

export const sendOTP = async (user) => {
  const confirmToken = user.createOTP();
  await user.save();
  const html = generateTwoStepAuthTemplate(confirmToken);
  const data = {
    email: user.email,
    subject: "Two step authentication",
    html,
  };
  await sendEmail(data);
};
