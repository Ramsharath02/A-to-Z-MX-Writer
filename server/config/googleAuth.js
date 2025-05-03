const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");

const CREDENTIALS_PATH = path.join(__dirname, "../credentials.json");
const TOKEN_PATH = path.join(__dirname, "../token.json");

const authorize = async () => {
  const content = fs.readFileSync(CREDENTIALS_PATH, "utf8");
  const { client_secret, client_id, redirect_uris } = JSON.parse(content).installed;
  const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  if (fs.existsSync(TOKEN_PATH)) {
    oAuth2Client.setCredentials(JSON.parse(fs.readFileSync(TOKEN_PATH)));
    console.log("✅ Google OAuth authorized.");
  } else {
    throw new Error("❌ Token not found.");
  }

  return oAuth2Client;
};

module.exports = { authorize };
