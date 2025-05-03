const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
  
    // 🔐 Replace with your real token or JWT verification logic
    if (token === "Bearer your-static-token-here") {
      return next();
    }
  
    return res.status(401).json({ message: "Unauthorized" });
  };
  
  module.exports = authMiddleware;
  