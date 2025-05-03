const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { parse } = require("json2csv");
const { getProviderForDomain, extractDomainFromEmail } = require("../helpers/dnsHelper");
const { sendSlackLog, sendEmailWithDriveLink } = require("../helpers/notifications");
const { authorize, uploadFileToDrive } = require("../helpers/googleDriveHelper");

// Function to handle Slack log messages
const logToSlack = async (message) => {
  try {
    await sendSlackLog(message);
  } catch (error) {
    console.error("❌ Failed to send Slack message", error);
  }
};

// Function to clean up temporary files
const cleanupTempFile = (filePath) => {
  try {
    fs.unlinkSync(filePath);
    console.log("🧹 Deleted temp upload:", filePath);
  } catch (err) {
    console.error("❌ Failed to delete temp upload:", filePath);
  }
};

// Function to process the uploaded CSV file
const processCsvFile = async (filePath) => {
  const results = [];
  const seenEmails = new Set();

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        const possibleEmail = row.Email || row.email || row.Website || row.website;
        if (possibleEmail) {
          const cleanEmail = possibleEmail.trim().toLowerCase();
          if (!seenEmails.has(cleanEmail)) {
            seenEmails.add(cleanEmail);
            const domain = extractDomainFromEmail(cleanEmail);
            if (domain) {
              results.push({ email: cleanEmail, ...row, domain });
            }
          }
        }
      })
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
};

// Function to enrich the CSV with domain providers
const enrichCsvData = async (results) => {
  const uniqueDomains = [...new Set(results.map((entry) => entry.domain))];
  const domainProviderMap = {};
  const limit = (await import("p-limit")).default;
  const pLimit = limit(10);

  const lookupTasks = uniqueDomains.map((domain) =>
    pLimit(async () => {
      const provider = await getProviderForDomain(domain);
      domainProviderMap[domain] = provider;
    })
  );

  await Promise.all(lookupTasks);

  return results.map((entry) => {
    const { Website, website, Email, ...rest } = entry;
    return {
      ...rest,
      Provider: domainProviderMap[entry.domain] || "unknown",
    };
  });
};

// Function to save enriched CSV to disk
const saveEnrichedCsv = (enrichedData, csvName) => {
  const enrichedDir = path.join(__dirname, "../enriched");
  if (!fs.existsSync(enrichedDir)) fs.mkdirSync(enrichedDir);

  const updatedFilePath = path.join(enrichedDir, `enriched-${Date.now()}.csv`);
  const csvData = parse(enrichedData);
  fs.writeFileSync(updatedFilePath, csvData);
  console.log("✅ Enriched CSV saved to:", updatedFilePath);

  return updatedFilePath;
};

// Function to handle email and Slack report after processing
const sendReport = async (name, email, csvName, successCount, failedCount, timeTaken) => {
  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;
  const formatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const slackMessage = `
📩 *MX Excluder Report*
*Name:* ${name}
*User Email:* ${email}
*File Name:* ${csvName || "Unnamed CSV"}
*Success Rows:* ${successCount}
*Failed Rows:* ${failedCount}
*Email Sent:* ✅
*Processing Time:* ${formatted}s
`;

  await logToSlack(slackMessage);
};

// Main function to handle CSV upload and processing
const uploadCsv = async (req, res) => {
  try {
    console.log("📥 Upload CSV route hit");

    const { name, email, csvName } = req.body;
    const slackEnterMessage = `
*MX Excluder User entered*
*Name:* ${name}
*User Email:* ${email}
*File Name:* ${csvName || "Unnamed CSV"}
`;
    await logToSlack(slackEnterMessage);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    console.log("📄 Processing file:", filePath);

    // Step 1: Process the CSV file
    const results = await processCsvFile(filePath);
    if (results.length === 0) {
      return res.status(400).json({ error: "CSV is empty or invalid format." });
    }

    console.log("✅ CSV parsed. Unique emails:", results.length);

    // Step 2: Enrich data with domain provider info
    const enriched = await enrichCsvData(results);

    // Step 3: Save enriched CSV
    const updatedFilePath = saveEnrichedCsv(enriched, csvName);

    // Step 4: Clean up original CSV
    cleanupTempFile(filePath);

    // Step 5: Upload enriched CSV to Google Drive
    const auth = await authorize();
    const fileId = await uploadFileToDrive(auth, updatedFilePath, csvName);

    // Step 6: Send email with download link
    await sendEmailWithDriveLink(auth, name, email, fileId, csvName || "Processed Data");

    // Step 7: Send Slack report
    const timeTaken = ((Date.now() - startTime) / 1000).toFixed(2);
    const failedCount = enriched.filter((e) => e.Provider === "unknown").length;
    const successCount = enriched.length - failedCount;
    await sendReport(name, email, csvName, successCount, failedCount, timeTaken);

    // Step 8: Final response to the client
    res.json({ message: "File uploaded and email sent successfully!" });

    // Optionally, delete the enriched file after email is sent
    cleanupTempFile(updatedFilePath);
  } catch (error) {
    console.error("❌ Error processing the CSV:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { uploadCsv };
