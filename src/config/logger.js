// logger.js
import { createLogger, format, transports } from "winston";
import path from "path";
import fs from "fs";

let logger;

const initLogger = (logDirectory) => {
	if (!fs.existsSync(logDirectory)) {
		fs.mkdirSync(logDirectory, { recursive: true });
	}

	const errorLogPath = path.join(logDirectory, "error.log");
	const warnLogPath = path.join(logDirectory, "warn.log");
	const infoLogPath = path.join(logDirectory, "info.log");

	// Define custom formats for console and file transports
	const consoleFormat = format.combine(
		format.colorize(),
		format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
		format.printf((info) => {
			const { timestamp, level } = info;
			let message = info.message;

			// Handle cases where message is an object (due to options being passed)
			if (typeof message === "object") {
				message = message.message || JSON.stringify(message);
			}

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
			new transports.File({
				filename: errorLogPath,
				level: "error",
				format: fileFormat, // Use JSON format for files
			}),
			new transports.File({
				filename: warnLogPath,
				level: "warn",
				format: fileFormat,
			}),
			new transports.File({
				filename: infoLogPath,
				level: "info",
				format: fileFormat,
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
	if (Object.keys(options).length === 0) {
		loggerInstance.info(message);
	} else {
		loggerInstance.info({ message, ...options });
	}
};

/**
 * Logs a message with warn level.
 *
 * @param {string} message The message to log.
 * @param {Object} [options] Additional options for the log message.
 */
const logWarning = (message, options = {}) => {
	const loggerInstance = getLogger();
	if (Object.keys(options).length === 0) {
		loggerInstance.warn(message);
	} else {
		loggerInstance.warn({ message, ...options });
	}
};

/**
 * Logs a message with error level.
 *
 * @param {string} message The message to log.
 * @param {Object} [options] Additional options for the log message.
 */
const logError = (message, options = {}) => {
	const loggerInstance = getLogger();
	if (Object.keys(options).length === 0) {
		loggerInstance.error(message);
	} else {
		loggerInstance.error({ message, ...options });
	}
};

export { initLogger, getLogger, logInfo, logWarning, logError };
