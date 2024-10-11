import ApplicationError from "./ApplicationError.js";

export default class AuthorizationError extends ApplicationError {
	constructor(
		publicMessage = "Authorization failed",
		error,
		customErrorMessage = ""
	) {
		if (!error || !(error instanceof Error)) {
			error = new Error(publicMessage);
		}

		super(error, 403, publicMessage, customErrorMessage);
	}
}
