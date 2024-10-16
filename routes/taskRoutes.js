const express = require("express");

const verifyToken = require("../middlewares/verifyToken");
const { getTasks, submitTaskAnswer, addTask, getTaskAnswer } = require("../controllers/taskController");

const router = express.Router();

router.get("/", getTasks);
router.post("/submit", verifyToken, submitTaskAnswer);
router.post("/", verifyToken, addTask);
router.get("/answer", verifyToken, getTaskAnswer);

module.exports = router;
