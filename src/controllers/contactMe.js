//send email request
import sendEmail from "../middleware/sendEmail.js";
export const contactMe = async (req, res) => {
  const { name, email, subject, message } = req.body;
  try {
    await sendEmail(name, email, subject, message);
    res.send("Email sent");
  } catch (error) {
    console.log(error);
    res.status(500).send("Error sending email");
  }
};
