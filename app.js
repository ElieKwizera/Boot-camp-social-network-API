const express = require("express");
const dotenv = require("dotenv");
const logger = require("./middleware/logger");
const DBConnect = require("./config/db");

const colors = require("colors");

const bootcampRoutes = require("./routes/bootcamps");

// load environment variables

dotenv.config({ path: "./config/config.env" });
DBConnect();

const app = express();

app.use(express.json());

app.use(logger);

app.use("/api/bootcamps", bootcampRoutes);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`server running on ${PORT}`.cyan);
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`err: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
