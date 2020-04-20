const express = require("express");
const dotenv = require("dotenv");
const path = require('path');

// custom middleware

const DBConnect = require("./config/db");
const errorHandler = require("./middleware/error");
const fileupload = require('express-fileupload');

//third party dependencies

const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const CORS = require('cors');
const colors = require("colors");

const bootcampRoutes = require("./routes/bootcamps");
const courseRoutes = require("./routes/courses");
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/users');
const reviewsRoutes = require('./routes/reviews');

// load environment variables

dotenv.config({path: "./config/config.env"});
DBConnect();

const app = express();

app.use(express.json());

app.use(cookieParser());
//app.use(logger);

app.use(fileupload());
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());

const limiter = rateLimit(
    {
        windowMs: 10*60*1000,
        max:1
    }
);
app.use(limiter);
app.use(hpp());
app.use(CORS());
app.use(express.static(path.join(__dirname,'public')));

app.use('/api/bootcamps', bootcampRoutes);
app.use('/api/courses',courseRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/users',adminRoutes);
app.use('/api/reviews',reviewsRoutes);


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

