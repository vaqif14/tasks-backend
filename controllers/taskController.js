const { Task, TaskOption } = require("../models");
const logger = require("../utils/logger");

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      include: [{ model: TaskOption, as: "options", attributes: { exclude: ["isCorrect"] } }],
    });
    logger.info("Tasks fetched successfully");
    return res.json(tasks);
  } catch (err) {
    logger.error("Error fetching tasks: %o", err);
    return res.status(500).json({ error: "Could not fetch tasks" });
  }
};

exports.addTask = async (req, res) => {
  const { instruction, options } = req.body;

  if (!instruction || !Array.isArray(options) || options.length === 0) {
    logger.warn("Invalid task or options provided");
    return res.status(400).json({ error: "Invalid task or options" });
  }

  try {
    const task = await Task.create({ instruction });
    const taskOptions = options.map((option) => ({
      optionText: option.text,
      isCorrect: option.isCorrect || false,
      taskId: task.id,
    }));
    await TaskOption.bulkCreate(taskOptions);

    logger.info("Task created successfully: %s", task.id);
    return res.status(201).json({ message: "Task created successfully", taskId: task.id });
  } catch (err) {
    logger.error("Error adding task: %o", err);
    return res.status(500).json({ error: "Could not add task" });
  }
};

exports.submitTaskAnswer = async (req, res) => {
  const answers = req.body;

  if (!Array.isArray(answers) || answers.length === 0) {
    logger.warn("Invalid input format or empty array received.");
    return res.status(400).json({ error: "Invalid input format or empty array." });
  }

  try {
    let correctCount = 0;

    const results = await Promise.all(
      answers.map(async ({ taskId, optionId }) => {
        const taskOption = await TaskOption.findOne({ where: { id: optionId } });

        if (!taskOption) {
          logger.warn("Invalid option ID: %s", optionId);
          return { taskId, optionId, correct: false, error: "Invalid option ID" };
        }

        const isCorrect = taskOption.isCorrect;
        if (isCorrect) {
          correctCount += 1;
        }

        logger.info("Task answer submitted: taskId=%s, optionId=%s", taskId, optionId);
        return { taskId, optionId, correct: isCorrect };
      })
    );

    const score = (correctCount / answers.length) * 100;

    return res.json({
      results,
      score,
      correctCount,
      totalQuestions: answers.length,
    });
  } catch (err) {
    logger.error("Error submitting task answers: %o", err);
    return res.status(500).json({ error: "Could not submit task answers" });
  }
};

exports.getTaskAnswer = async (req, res) => {
  const { id } = req.query;

  if (!id) {
    logger.warn("Task ID is required");
    return res.status(400).json({ error: "Task ID is required" });
  }

  try {
    const taskOptions = await TaskOption.findAll({
      where: { taskId: id, isCorrect: true },
      attributes: ["id", "optionText"],
    });

    if (!taskOptions.length) {
      logger.warn("No correct options found for task ID: %s", id);
      return res.status(404).json({ error: "No correct options found" });
    }

    const correctOption = taskOptions.map((option) => ({
      id: option.id,
      answer: option.optionText,
    }));

    logger.info("Correct answers fetched for task ID: %s", id);
    return res.json(correctOption[0]);
  } catch (err) {
    logger.error("Error fetching task answers: %o", err);
    return res.status(500).json({ error: "Could not fetch task answers" });
  }
};
