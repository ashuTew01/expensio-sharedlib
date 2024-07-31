import { createLogger, format, transports } from "winston";
import path from "path";
import fs from "fs";

const logFormat = format.combine(
	format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
	format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
);

const createLoggerInstance = (logDirectory) => {
	if (!fs.existsSync(logDirectory)) {
		fs.mkdirSync(logDirectory, { recursive: true });
	}

	const logFilePath = path.join(logDirectory, "errors.log");

	return createLogger({
		level: "debug", // set to 'debug' to capture (almost) all levels of logs
		format: logFormat,
		transports: [
			new transports.Console({
				level: "debug",
				format: format.combine(format.colorize(), logFormat),
			}),
			new transports.File({
				filename: logFilePath,
				level: "debug",
				format: format.combine(
					format.uncolorize(),
					format.timestamp(),
					format.json()
				),
			}),
		],
	});
};

export default createLoggerInstance;
