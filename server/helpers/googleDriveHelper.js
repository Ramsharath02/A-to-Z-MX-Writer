const { google } = require("googleapis");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

// Load client secrets from a local file.
// const CREDENTIALS_PATH = path.join(__dirname, "credentials.json");
const CREDENTIALS_PATH = path.join(__dirname, "../credentials.json"); // Correctly set the path
const TOKEN_PATH = path.join(__dirname, "../token.json");   

const SCOPES = ["https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/gmail.send"];

// Authorize a client with credentials, then call the Google Drive API.
const authorize = async () => {
    const content = fs.readFileSync(CREDENTIALS_PATH, 'utf8');
    const { client_secret, client_id, redirect_uris } = JSON.parse(content).installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    if (fs.existsSync(TOKEN_PATH)) {
        oAuth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH)));
    } else {
        throw new Error("Token not found. Please authenticate first.");
    }
    return oAuth2Client;
};

// Upload file to Google Drive
const uploadFileToDrive = async (auth, filePath) => {
    const drive = google.drive({ version: "v3", auth });
    const fileMetadata = {
        name: path.basename(filePath),
        mimeType: "application/vnd.ms-excel",
    };
    const media = {
        mimeType: "application/vnd.ms-excel",
        body: fs.createReadStream(filePath),
    };
    const file = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: "id",
    });
    return file.data.id; // Return the file ID
};

// Send email with attachment
const sendEmail = async (recipientEmail, fileId) => {
    const auth = await authorize();
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: "pushkar24io047@gmail.com", // Your email
            clientId: auth._clientId,
            clientSecret: auth._clientSecret,
            refreshToken: auth.credentials.refresh_token,
            accessToken: auth.credentials.access_token,
        },
    });

    const mailOptions = {
        from: "pushkar24io047@gmail.com",
        to: recipientEmail,
        subject: "Updated CSV File",
        text: "Please find the updated CSV file attached.",
        attachments: [
            {
                filename: "output.csv",
                path: `https://drive.google.com/uc?id=${fileId}`, // Link to the file
            },
        ],
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { uploadFileToDrive, sendEmail, authorize };