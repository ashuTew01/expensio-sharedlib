import ApplicationError from "./ApplicationError.js";

export default class NotFoundError extends ApplicationError {
	constructor(
		message = "The requested resource was not found",
		error,
		publicMessage = ""
	) {
		if (!error || !(error instanceof Error)) {
			error = new Error(message);
		}
		publicMessage = publicMessage || message;

		super(error, 404, publicMessage);
	}
}
