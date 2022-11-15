const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const createHttpError = require('http-errors');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const mongoose = require('mongoose');
const morgan = require('morgan');
const fs = require('fs');
const rfs = require('rotating-file-stream');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// set static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// setup rate limiter (100 requests per 30 seconds)
const limiter = rateLimit({
    windowMs: 30 * 1000,
    max: 100,
});
app.use(limiter);

// create a rotating write stream
const logDirectory = path.join(__dirname, 'log');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
const accessLogStream = rfs.createStream('access.log', {
    interval: '1h',
    path: logDirectory
});

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan("dev"));

// setup the helmet
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// setup the cors
const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

// setup the body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// setup the mongoose
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.log('Error:', err.message);
});

// setup the routes
app.use(`/api/v${process.env.API_VERSION}`, require('./routes/index'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createHttpError(404));
});

// setup the error handler
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: req.app.get('env') === 'development' ? err : {}
    });
});

module.exports = app;