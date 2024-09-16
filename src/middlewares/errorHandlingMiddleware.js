import { logError, logWarning, logInfo } from "../config/logger.js";

const errorHandlingMiddleware = (err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	res.status(statusCode).json({ error: "An internal server error occurred" });
	// const publicMessage =
	// 	err.publicMessage || err.message || "An internal server error occurred";

	// if (statusCode >= 500) {
	// 	logError(
	// 		`${statusCode} - ${err.name}: ${err.message}`
	// 		// 	{
	// 		// 	url: req.originalUrl,
	// 		// 	body: req.body,
	// 		// 	method: req.method,
	// 		// 	ip: req.ip,
	// 		// 	errorStack: err.stack,
	// 		// }
	// 	);
	// } else if (statusCode >= 400) {
	// 	logWarning(
	// 		`${statusCode} - ${err.name}: ${err.message}`
	// 		// 	{
	// 		// 	url: req.originalUrl,
	// 		// 	body: req.body,
	// 		// 	method: req.method,
	// 		// 	ip: req.ip,
	// 		// 	errorStack: err.stack,
	// 		// }
	// 	);
	// } else {
	// 	logInfo(
	// 		`${statusCode} - ${err.name}: ${err.message}`
	// 		// 	{
	// 		// 	url: req.originalUrl,
	// 		// 	body: req.body,
	// 		// 	method: req.method,
	// 		// 	ip: req.ip,
	// 		// 	errorStack: err.stack,
	// 		// }
	// 	);
	// }

	// res.status(statusCode).json({ error: publicMessage });
};

export default errorHandlingMiddleware;
