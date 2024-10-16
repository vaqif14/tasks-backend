const express = require("express");
const { connectDB } = require("./database");
const bodyParser = require("body-parser");
const cors = require("cors");
const logger = require("./utils/logger");
const errorHandler = require("./middlewares/errorHandler");
const routes = require("./routes/index");

require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
connectDB();

app.use(express.json());
app.use("/api", routes);

app.use(errorHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
