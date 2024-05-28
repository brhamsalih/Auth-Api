import nodemailer from "nodemailer";
const sendEmail = async (name, email, subject, message) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "your-email@gmail.com",
      pass: "your-passwrod",
    },
  });

  const mailOptions = {
    from: "your-email@gmail.com",
    to: email,
    subject,
    text: `Dear: ${name}\n ${message}`,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
