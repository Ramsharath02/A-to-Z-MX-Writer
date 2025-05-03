function extractDomainFromEmail(email) {
    const match = email.match(/@(.+)$/);
    return match ? match[1].toLowerCase() : null;
  }
  
  module.exports = { extractDomainFromEmail };
  