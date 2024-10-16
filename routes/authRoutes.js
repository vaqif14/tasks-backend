const express = require("express");
const sessionController = require("../controllers/sessionController");

const router = express.Router();

router.post("/token", sessionController.generateSessionToken);

module.exports = router;
