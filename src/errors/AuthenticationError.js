import ApplicationError from "./ApplicationError.js";

export default class AuthenticationError extends ApplicationError {
	constructor(
		publicMessage = "Authentication failed",
		error,
		customErrorMessage = ""
	) {
		if (!error || !(error instanceof Error)) {
			error = new Error(customErrorMessage || publicMessage);
		}

		super(error, 401, publicMessage, customErrorMessage);
	}
}
