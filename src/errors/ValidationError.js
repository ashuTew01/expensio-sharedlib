import ApplicationError from "./ApplicationError.js";

export default class ValidationError extends ApplicationError {
	constructor(
		publicMessage = "Validation failed",
		error,
		customErrorMessage = ""
	) {
		if (!error || !(error instanceof Error)) {
			error = new Error(customErrorMessage || publicMessage);
		}

		super(error, 400, publicMessage, customErrorMessage);
	}
}
