const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { parse } = require("json2csv");
const { extractDomainFromEmail } = require("../utils/dnsHelper");
const { getProviderForDomain } = require("../jobs/mxChecker");
const { authorize } = require("../config/googleAuth");
const { uploadFileToDrive } = require("../services/driveUploader");
const { sendEmailWithDriveLink } = require("../services/gmailSender");
const { sendSlackLog } = require("../services/slackLogger");

const uploadCsv = async (req, res) => {
  const { name, email, csvName } = req.body;

  await sendSlackLog(`
  *MX Excluder User entered*
  *Name:* ${name}
  *User Email:* ${email}
  *File Name:* ${csvName || "Unnamed CSV"}
  `);

  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const pLimit = (await import("p-limit")).default;
  const limit = pLimit(10);
  const filePath = req.file.path;

  const results = [];
  const seenEmails = new Set();

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
    .on("end", async () => {
      if (results.length === 0) {
        return res.status(400).json({ error: "CSV is empty or invalid format." });
      }

      const uniqueDomains = [...new Set(results.map((entry) => entry.domain))];
      const domainProviderMap = {};
      let completed = 0;
      let lastPercent = 0;
      const total = uniqueDomains.length;
      const startTime = Date.now();

      const lookupTasks = uniqueDomains.map((domain) =>
        limit(async () => {
          const provider = await getProviderForDomain(domain);
          domainProviderMap[domain] = provider;
          completed++;
          const percent = Math.floor((completed / total) * 100);
          if (percent >= lastPercent + 5 || percent === 100) {
            lastPercent = percent;
            const hashes = "#".repeat(Math.floor(percent / 5));
            const spaces = " ".repeat(20 - hashes.length);
            process.stdout.write(`\rProgress: [${hashes}${spaces}] ${percent}%`);
          }
        })
      );

      await Promise.all(lookupTasks);
      const enriched = results.map((entry) => {
        const { Website, website, Email, ...rest } = entry;
        return {
          ...rest,
          Provider: domainProviderMap[entry.domain] || "unknown",
        };
      });

      const csvData = parse(enriched);
      const updatedFilePath = path.join(__dirname, `../${path.basename(filePath)}`);
      fs.writeFileSync(updatedFilePath, csvData);

      const auth = await authorize();
      const fileId = await uploadFileToDrive(auth, updatedFilePath, csvName);
      await sendEmailWithDriveLink(auth, name, email, fileId, csvName || "Processed Data");

      return res.json({
        message: "✅ CSV processed and sent successfully!",
        totalRecords: enriched.length,
        downloadLink: `https://drive.google.com/file/d/${fileId}/view`,
      });
    });
};

module.exports = { uploadCsv };
