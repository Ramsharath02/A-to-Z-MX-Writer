const fs = require("fs");
const { google } = require("googleapis");

const sendEmailWithAttachment = async (auth, recipientEmail, filePath, csvName) => {
  const gmail = google.gmail({ version: "v1", auth });
  const fileData = fs.readFileSync(filePath).toString("base64");
  const boundary = "boundary_string";

  const rawMessage =
    `To: ${recipientEmail}\r\n` +
    "Subject: Your Processed CSV File\r\n" +
    "MIME-Version: 1.0\r\n" +
    `Content-Type: multipart/mixed; boundary=${boundary}\r\n\r\n` +
    `--${boundary}\r\n` +
    "Content-Type: text/plain; charset=UTF-8\r\n\r\n" +
    `Hello,\n\nYour requested CSV file "${csvName}" is attached.\n\nBest regards,\nYour Team\r\n\r\n` +
    `--${boundary}\r\n` +
    "Content-Type: text/csv\r\n" +
    `Content-Disposition: attachment; filename="${csvName}.csv"\r\n` +
    "Content-Transfer-Encoding: base64\r\n\r\n" +
    fileData +
    "\r\n\r\n" +
    `--${boundary}--`;

  const encodedMessage = Buffer.from(rawMessage)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw: encodedMessage },
  });

  console.log("✅ Email sent to:", recipientEmail);
};

const sendEmailWithDriveLink = async (auth, name, recipientEmail, fileId, csvName) => {
  const gmail = google.gmail({ version: "v1", auth });
  const drive = google.drive({ version: "v3", auth });

  await drive.permissions.create({
    fileId,
    requestBody: { role: "reader", type: "anyone" },
  });

  const webLink = `https://mxapi.atozemails.com/d/${fileId}`;
  const boundary = "boundary_string";

  const rawMessage = `To: ${recipientEmail}\r\n` +
    "Subject: Your Processed CSV File\r\n" +
    "MIME-Version: 1.0\r\n" +
    `Content-Type: multipart/alternative; boundary=${boundary}\r\n\r\n` +
    `--${boundary}\r\n` +
    "Content-Type: text/plain; charset=UTF-8\r\n\r\n" +
    `Hello ${name},\n\nDownload: ${webLink}\r\n\r\n` +
    `--${boundary}--`;

  const encodedMessage = Buffer.from(rawMessage)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  await gmail.users.messages.send({
    userId: "me",
    requestBody: { raw: encodedMessage },
  });

  console.log("✅ Email with Drive link sent to:", recipientEmail);
};

module.exports = { sendEmailWithAttachment, sendEmailWithDriveLink };
