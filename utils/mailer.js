const nodemailer = require('nodemailer');
const { renderContactEmail, renderCareerEmail } = require('./emailTemplate');

function sendMail(mailOptions) {
  if (process.env.EMAIL_PASS) {
    const gmailTransport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    return gmailTransport.sendMail(mailOptions);
  }
  const sendmailTransport = nodemailer.createTransport({
    sendmail: true,
    newline: 'unix',
    path: '/usr/sbin/sendmail',
  });
  return sendmailTransport.sendMail(mailOptions);
}

exports.sendContactNotification = async (data) => {
  const html = renderContactEmail(data);

  const mailOptions = {
    from: `"N.A.R.S. Associates" <narsassociates442@gmail.com>`,
    to: 'narsassociates442@gmail.com',
    subject: `New ${data.type.toUpperCase()} Submission - ${data.name || data.email}`,
    html,
  };

  try {
    const info = await sendMail(mailOptions);
    console.log('Email sent for', data.type, 'submission — ID:', info.messageId);
  } catch (err) {
    console.error('Failed to send email for', data.type, 'submission:', err.message);
    console.log('Submission saved to DB.');
  }
};

exports.sendCareerNotification = async (data) => {
  const html = renderCareerEmail(data);

  const mailOptions = {
    from: `"N.A.R.S. Career" <narsassociates442@gmail.com>`,
    to: 'narsassociates442@gmail.com',
    subject: `Job Application: ${data.position} - ${data.fullName}`,
    html,
  };

  try {
    const info = await sendMail(mailOptions);
    console.log('Career email sent — ID:', info.messageId);
  } catch (err) {
    console.error('Failed to send career email:', err.message);
    console.log('Application saved to DB.');
  }
};
