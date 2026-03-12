const morgan = require('morgan');
const logger = require('../config/logger');

morgan.token('requestId', (req) => req.requestId || '-');

const format = ':requestId :method :url :status :res[content-length] - :response-time ms';

const stream = {
    write: (message) => {
        logger.http(message.trim());
    }
};

const httpLogger = morgan(format, {
    stream,
    skip: (req) => req.path === '/api/csrf-token'
});

module.exports = httpLogger;
