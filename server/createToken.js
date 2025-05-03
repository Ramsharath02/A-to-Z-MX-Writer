const express = require('express');
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

// Path to your credentials and token files
const CREDENTIALS_PATH = path.join(__dirname, "./credentials.json");
const TOKEN_PATH = path.join(__dirname, "./token.json");

// Scopes for Google Drive and Gmail
const SCOPES = ["https://www.googleapis.com/auth/drive.file", "https://www.googleapis.com/auth/gmail.send"];

// Create an Express application
const app = express();
const PORT = 5000; // Change this to your desired port

// Load client secrets from a local file
fs.readFile(CREDENTIALS_PATH, (err, content) => {
    if (err) return console.error('Error loading client secret file:', err);
    authorize(JSON.parse(content));
});

// Authorize a client with credentials Synchronously
function authorize(credentials) {
    const { client_secret, client_id, redirect_uris } = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    // Generate the authorization URL
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);

    // Start the server to handle the redirect
    app.get('/oauth2callback', (req, res) => {
        const code = req.query.code;
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            res.send('Authorization successful! You can close this tab.');
        });
    });

    // Start the Express server
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}