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

  let info = await transporter.sendMail({
    from,
    to,
    subject,
    html,
  });

  console.log('NODEMAILER: ', info);
}

module.exports = sendmail;
