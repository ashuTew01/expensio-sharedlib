import ApplicationError from "./ApplicationError.js";

export default class DatabaseError extends ApplicationError {
	constructor(
		publicMessage = "An error occurred with the database operation",
		error,
		customErrorMessage = ""
	) {
		if (!error || !(error instanceof Error)) {
			error = new Error(customErrorMessage || publicMessage);
		}

		super(error, 500, publicMessage, customErrorMessage);
	}
}
