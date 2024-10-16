const jwt = require("jsonwebtoken");
const { SessionToken } = require("../models");
const logger = require("../utils/logger");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    logger.warn("Token is missing");
    return res.status(401).json({ error: "Token is required" });
  }

  const token = authHeader;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      logger.warn("Invalid token: %s", token);
      return res.status(401).json({ error: "Invalid token" });
    }
    const session = await SessionToken.findOne({ where: { token } });
    if (!session) {
      logger.warn("Invalid session for token: %s", token);
      return res.status(401).json({ error: "Invalid session" });
    }

    req.session = session;
    logger.info("Token verified successfully");
    next();
  } catch (err) {
    logger.error("Invalid or expired token: %o", err);
    return res.status(401).json({ error: "Token is invalid or expired" });
  }
};

module.exports = verifyToken;
