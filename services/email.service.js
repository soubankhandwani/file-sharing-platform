const nodemailer = require('nodemailer');

async function sendmail({ from, to, subject, html }) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASS,
    },
  });

  await transporter.sendMail({
    from,
    to,
    subject,
    html,
  });
}

module.exports = sendmail;
