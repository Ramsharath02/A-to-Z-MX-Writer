const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");

const FOLDER_ID = "1igfx4syDdO6ZPb4i-N2jKup1iHM7PEL4";

const uploadFileToDrive = async (auth, filePath, csvName) => {
  const drive = google.drive({ version: "v3", auth });
  const fileMetadata = {
    name: csvName,
    mimeType: "text/csv",
    parents: [FOLDER_ID],
  };
  const media = { mimeType: "text/csv", body: fs.createReadStream(filePath) };
  const file = await drive.files.create({
    resource: fileMetadata,
    media,
    fields: "id",
  });
  console.log("✅ Uploaded with Drive ID:", file.data.id);
  return file.data.id;
};

const convertToGoogleSheet = async (auth, fileId) => {
  const drive = google.drive({ version: "v3", auth });
  const copyFile = await drive.files.copy({
    fileId,
    resource: {
      mimeType: "application/vnd.google-apps.spreadsheet",
      name: "Converted Sheet",
    },
  });

  const sheetId = copyFile.data.id;
  const exportPath = path.join(__dirname, `../downloads/${sheetId}.csv`);
  const dest = fs.createWriteStream(exportPath);

  await new Promise((resolve, reject) => {
    drive.files.export(
      { fileId: sheetId, mimeType: "text/csv" },
      { responseType: "stream" },
      (err, res) => {
        if (err) return reject(err);
        res.data.on("end", resolve).on("error", reject).pipe(dest);
      }
    );
  });

  return { sheetId, exportPath };
};

module.exports = { uploadFileToDrive, convertToGoogleSheet };
