import { logError, logWarning, logInfo } from "../config/logger.js";
import ApplicationError from "../errors/ApplicationError.js"; // Assuming ApplicationError is the base class

const errorHandlingMiddleware = (err, req, res, next) => {
	try {
		const isCustomError = err instanceof ApplicationError;

		// Extracting statusCode and publicMessage
		const statusCode = isCustomError ? err.statusCode : 500;
		const publicMessage = isCustomError
			? err.publicMessage
			: "An unexpected error occurred. Please try again later.";

		// Log error details based on severity (statusCode)
		if (statusCode >= 500) {
			logError(`${statusCode} - ${err.name || "Error"}: ${err.message}`, {
				url: req.originalUrl,
				body: req.body,
				method: req.method,
				ip: req.ip,
				errorStack: err.stack || "No stack available",
				originalError:
					isCustomError && !err.isSentErrorPublic ? err.originalError : null,
			});
		} else if (statusCode >= 400) {
			logWarning(`${statusCode} - ${err.name || "Error"}: ${err.message}`, {
				url: req.originalUrl,
				body: req.body,
				method: req.method,
				ip: req.ip,
				errorStack: err.stack || "No stack available",
			});
		} else {
			logInfo(`${statusCode} - ${err.name || "Info"}: ${err.message}`, {
				url: req.originalUrl,
				body: req.body,
				method: req.method,
				ip: req.ip,
				errorStack: err.stack || "No stack available",
			});
		}

		// Build a professional error response
		const errorResponse = {
			status: statusCode,
			error: {
				type: err.name || "Error", // Use the error name or fallback to "Error"
				message: publicMessage, // The public message for the user
				...(isCustomError &&
					err.isSentErrorPublic &&
					err.details && { details: err.details }), // Optionally include details if present
			},
		};

		// Send a structured, professional error response to the client
		res.status(statusCode).json(errorResponse);
	} catch (error) {
		logError(error.message);
		res.status(500).json({
			status: 500,
			error: {
				type: "InternalServerError",
				message: "An unexpected error occurred. Please try again later.",
			},
		});
	}
};

export default errorHandlingMiddleware;
