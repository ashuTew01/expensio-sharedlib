// logger.js
import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";
import fs from "fs";

let logger;

const initLogger = (logDirectory) => {
	if (!fs.existsSync(logDirectory)) {
		fs.mkdirSync(logDirectory, { recursive: true });
	}

	// Define custom formats for console and file transports
	const consoleFormat = format.combine(
		format.colorize(),
		format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
		format.printf(({ timestamp, level, message }) => {
			return `${timestamp} ${level}: ${message}`;
		})
	);

	const fileFormat = format.combine(
		format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
		format.uncolorize(),
		format.json()
	);

	logger = createLogger({
		level: "debug", // Capture all levels of logs
		transports: [
			new transports.Console({
				level: "debug",
				format: consoleFormat, // Use custom console format
			}),
			// Configure daily rotate file transport for error logs
			new DailyRotateFile({
				filename: path.join(logDirectory, "error-%DATE%.log"),
				datePattern: "YYYY-MM-DD", // Rotate daily
				level: "error",
				format: fileFormat,
				maxSize: "20m", // Maximum size of the file before it's rotated
				maxFiles: "14d", // Keep logs for the last 14 days
				zippedArchive: true, // Compress rotated files
			}),
			// Configure daily rotate file transport for warn logs
			new DailyRotateFile({
				filename: path.join(logDirectory, "warn-%DATE%.log"),
				datePattern: "YYYY-MM-DD",
				level: "warn",
				format: fileFormat,
				maxSize: "20m",
				maxFiles: "14d",
				zippedArchive: true,
			}),
			// Configure daily rotate file transport for info logs
			new DailyRotateFile({
				filename: path.join(logDirectory, "info-%DATE%.log"),
				datePattern: "YYYY-MM-DD",
				level: "info",
				format: fileFormat,
				maxSize: "20m",
				maxFiles: "14d",
				zippedArchive: true,
			}),
		],
	});
};

const getLogger = () => {
	if (!logger) {
		throw new Error("Logger not initialized. Call initLogger first.");
	}
	return logger;
};

/**
 * Logs a message with info level.
 *
 * @param {string} message The message to log.
 * @param {Object} [options] Additional options for the log message.
 */
const logInfo = (message, options = {}) => {
	const loggerInstance = getLogger();
	loggerInstance.info(message, options);
};

/**
 * Logs a message with warn level.
 *
 * @param {string} message The message to log.
 * @param {Object} [options] Additional options for the log message.
 */
const logWarning = (message, options = {}) => {
	const loggerInstance = getLogger();
	loggerInstance.warn(message, options);
};

/**
 * Logs a message with error level.
 *
 * @param {string} message The message to log.
 * @param {Object} [options] Additional options for the log message.
 */
const logError = (message, options = {}) => {
	const loggerInstance = getLogger();
	loggerInstance.error(message, options);
};

export { initLogger, getLogger, logInfo, logWarning, logError };
