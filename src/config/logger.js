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

// Wrapper methods for different log levels
const logInfo = (message) => {
	const loggerInstance = getLogger();
	loggerInstance.info(message);
};

const logWarning = (message) => {
	const loggerInstance = getLogger();
	loggerInstance.warn(message);
};

const logError = (message) => {
	const loggerInstance = getLogger();
	loggerInstance.error(message);
};

export { initLogger, getLogger, logInfo, logWarning, logError };
