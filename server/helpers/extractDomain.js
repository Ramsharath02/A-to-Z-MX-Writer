const extractDomainFromEmail = (email) => {
    try {
      return email.split("@")[1].trim().toLowerCase();
    } catch {
      return null;
    }
  };
  
  module.exports = { extractDomainFromEmail };
  