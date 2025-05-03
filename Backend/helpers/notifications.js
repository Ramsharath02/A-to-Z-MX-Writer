const axios = require('axios');
const nodemailer = require('nodemailer');

// Function to send log message to Slack
const sendSlackLog = async (message) => {
  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL; // Set your Slack webhook URL as an environment variable

  try {
    const payload = {
      text: message,
    };
    await axios.post(slackWebhookUrl, payload);
    console.log("✅ Sent Slack message successfully!");
  } catch (error) {
    console.error("❌ Failed to send Slack message:", error);
    throw error;
  }
};

// Function to send email with a link to the uploaded file on Google Drive
const sendEmailWithDriveLink = async (auth, name, email, fileId, fileName) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER, // Set your Gmail email as an environment variable
      pass: process.env.GMAIL_PASS, // Set your Gmail password as an environment variable
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: `Your processed file - ${fileName}`,
    text: `Hi ${name},\n\nYour file has been processed successfully. You can download it from the link below:\n\nhttps://drive.google.com/file/d/${fileId}/view\n\nBest regards,\nA to Z MX Writer Team`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully!");
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    throw error;
  }
};

module.exports = { sendSlackLog, sendEmailWithDriveLink };
