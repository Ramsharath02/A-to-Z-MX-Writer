const dns = require("dns").promises;

/**
 * Detect the email service provider based on MX records,
 * prioritizing the one with the lowest MX priority (highest delivery preference).
 */
const getProviderFromMxRecords = (mxRecords) => {
    const providerPatterns = {
        google: ["google", "l.google.com"],
        microsoft: ["outlook.com", "microsoft", "protection.outlook.com"],
        yahoo: ["yahoodns.net", "yahoo.com"],
        zoho: ["zoho.com", "zohomail", "zoho.in"],
        protonmail: ["protonmail", "proton.ch"],
        apple: ["icloud", "me.com", "mac.com"],
        yandex: ["yandex"],
        mailgun: ["mailgun.org", "mailgun.com"],
        sendgrid: ["sendgrid.net"],
        fastmail: ["fastmail", "messagingengine.com"],
        proofpoint: ["ppe-hosted.com", "proofpoint.com"],
        barracuda: ["barracudanetworks.com"],
        mimecast: ["mimecast.com"],
        emailfiltering: ["emailfiltering.com"],
        symantec: ["messagelabs.com"],
        godaddy: ["secureserver.net"],
        ionos: ["1and1.com", "ionos.com"],
        rackspace: ["rackspace.com"],
        tencent: ["qq.com"],
        naver: ["naver.com"],
        rambler: ["mail.rambler.ru"],
        gandi: ["gandi.net"],
        armstrong: ["zoominternet.net"],
        postini: ["psmtp.com"]
    };

    // Sort MX records by ascending priority
    const sortedRecords = [...mxRecords].sort((a, b) => a.priority - b.priority);

    for (const mx of sortedRecords) {
        const hostname = mx.exchange.toLowerCase();
        for (const [provider, patterns] of Object.entries(providerPatterns)) {
            if (patterns.some(pattern => hostname.includes(pattern))) {
                return provider;
            }
        }
    }

    return "unknown";
};

/**
 * Get MX records for a domain and detect email provider.
 * @param {string} domain
 * @returns {Promise<{ provider: string, mxRecords: Array }>}
 */
const getMxRecords = async (domain) => {
    try {
        const mxRecords = await dns.resolveMx(domain);
        const provider = getProviderFromMxRecords(mxRecords);
        return { provider, mxRecords };
    } catch (error) {
        console.error(`DNS lookup failed for domain: ${domain}`, error.message);
        return { provider: "unknown", mxRecords: [] };
    }
};

module.exports = { getMxRecords };
