const jwt = require("jsonwebtoken");
const { SessionToken } = require("../models");
const logger = require("../utils/logger");

exports.generateSessionToken = async (req, res) => {
  try {
    const token = jwt.sign({ timestamp: Date.now() }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    await SessionToken.create({ token, expiresAt });
    return res.json({ token });
  } catch (err) {
    logger.error("Error fetching tasks: %o", err);
    return res.status(500).json({ error: "Could not generate token" });
  }
};
