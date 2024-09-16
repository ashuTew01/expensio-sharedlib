import { createLogger, format, transports } from "winston";
import path from "path";
import fs from "fs";

const logFormat = format.combine(
	format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
	format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);

let logger;

const initLogger = (logDirectory) => {
	if (!fs.existsSync(logDirectory)) {
		fs.mkdirSync(logDirectory, { recursive: true });
	}

	const errorLogPath = path.join(logDirectory, "error.log");
	const warnLogPath = path.join(logDirectory, "warn.log");
	const infoLogPath = path.join(logDirectory, "info.log");

	logger = createLogger({
		level: "debug", // set to 'debug' to capture (almost) all levels of logs
		format: logFormat,
		transports: [
			new transports.Console({
				level: "debug",
				format: format.combine(format.colorize(), logFormat),
			}),
			new transports.File({
				filename: errorLogPath,
				level: "error",
				format: format.combine(
					format.uncolorize(),
					format.timestamp(),
					format.json()
				),
			}),
			new transports.File({
				filename: warnLogPath,
				level: "warn",
				format: format.combine(
					format.uncolorize(),
					format.timestamp(),
					format.json()
				),
			}),
			new transports.File({
				filename: infoLogPath,
				level: "info",
				format: format.combine(
					format.uncolorize(),
					format.timestamp(),
					format.json()
				),
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
		loggerInstance.info(message, options);
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
		loggerInstance.warn(message, options);
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
		loggerInstance.error(message, options);
	}
};

export { initLogger, getLogger, logInfo, logWarning, logError };
