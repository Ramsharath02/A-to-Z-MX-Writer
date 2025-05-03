const { getMxRecords } = require("./dnsHelper");

const providerCache = new Map();
const providerLookupPromises = new Map();

const getProviderForDomain = async (domain) => {
  if (providerCache.has(domain)) return providerCache.get(domain);

  if (!providerLookupPromises.has(domain)) {
    providerLookupPromises.set(
      domain,
      getMxRecords(domain)
        .then(({ provider }) => {
          const normalized = provider.trim().toLowerCase();
          providerCache.set(domain, normalized);
          providerLookupPromises.delete(domain);
          return normalized;
        })
        .catch((err) => {
          console.error(`❌ MX lookup failed for ${domain}:`, err.message);
          providerLookupPromises.delete(domain);
          return "unknown";
        })
    );
  }

  return providerLookupPromises.get(domain);
};

module.exports = { getProviderForDomain };
