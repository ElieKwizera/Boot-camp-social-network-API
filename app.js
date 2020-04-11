const express = require("express");
const dotenv = require("dotenv");
const logger = require("./middleware/logger");
const DBConnect = require("./config/db");
const errorHandler = require("./middleware/error");
const fileupload = require('express-fileupload');
const path = require('path');

const colors = require("colors");

const bootcampRoutes = require("./routes/bootcamps");
const courseRoutes = require("./routes/courses");

// load environment variables

dotenv.config({path: "./config/config.env"});
DBConnect();

const app = express();

app.use(express.json());


//app.use(logger);

app.use(fileupload());

app.use(express.static(path.join(__dirname,'public')));

app.use("/api/bootcamps", bootcampRoutes);
app.use('/api/courses',courseRoutes);


app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () =>
{
    console.log(`server running on ${PORT}`.cyan);
});

process.on("unhandledRejection", (err, promise) =>
{
    console.log(`err: ${err.message}`);
    server.close(() =>
    {
        process.exit(1);
    });
});

