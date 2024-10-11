import ApplicationError from "./ApplicationError.js";

export default class ValidationError extends ApplicationError {
	constructor(message = "Validation failed", error, publicMessage = "") {
		if (!error || !(error instanceof Error)) {
			error = new Error(message);
		}
		publicMessage = publicMessage || message;

		super(error, 400, publicMessage);
	}
}
