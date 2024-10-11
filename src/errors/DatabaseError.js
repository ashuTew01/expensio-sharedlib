import ApplicationError from "./ApplicationError.js";

export default class DatabaseError extends ApplicationError {
	constructor(
		message = "An error occurred with the database operation",
		error,
		publicMessage = ""
	) {
		if (!error || !(error instanceof Error)) {
			error = new Error(message);
		}
		publicMessage = publicMessage || message;

		super(error, 500, publicMessage);
	}
}
