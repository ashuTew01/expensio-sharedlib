import ApplicationError from "./ApplicationError.js";

export default class ValidationError extends ApplicationError {
	constructor(
		publicMessage = "Validation failed",
		error,
		customErrorMessage = ""
	) {
		if (!error || !(error instanceof Error)) {
			error = new Error(publicMessage);
		}

		super(error, 400, publicMessage, customErrorMessage);
	}
}
