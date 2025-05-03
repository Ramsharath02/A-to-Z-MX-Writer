const dns = require("dns").promises;

const getProviderForDomain = async (domain) => {
  try {
    const mxRecords = await dns.resolveMx(domain);
    if (!mxRecords || mxRecords.length === 0) return "No MX records";

    const provider = mxRecords[0].exchange;
    if (provider.includes("google")) return "Google Workspace";
    if (provider.includes("outlook") || provider.includes("microsoft"))
      return "Microsoft 365";
    if (provider.includes("zoho")) return "Zoho Mail";
    return provider;
  } catch (error) {
    return "Lookup Failed";
  }
};

module.exports = { getProviderForDomain };
