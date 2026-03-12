const fs = require('fs');
const path = require('path');
const { createLogger, format, transports } = require('winston');

const isProduction = process.env.NODE_ENV === 'production';
const logsDir = path.join(__dirname, '..', 'logs');

if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const jsonFormat = format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json()
);

const devFormat = format.combine(
    format.colorize(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.printf(({ timestamp, level, message, stack, ...meta }) => {
        const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
        return `${timestamp} [${level}] ${stack || message}${metaString}`;
    })
);

const logger = createLogger({
    level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
    defaultMeta: { service: 'marsai-backend' },
    transports: [
        new transports.Console({
            format: isProduction ? jsonFormat : devFormat
        }),
        new transports.File({
            filename: path.join(logsDir, 'error.log'),
            level: 'error',
            format: jsonFormat
        }),
        new transports.File({
            filename: path.join(logsDir, 'combined.log'),
            format: jsonFormat
        })
    ],
    exceptionHandlers: [
        new transports.File({ filename: path.join(logsDir, 'exceptions.log') })
    ],
    rejectionHandlers: [
        new transports.File({ filename: path.join(logsDir, 'rejections.log') })
    ]
});

module.exports = logger;
