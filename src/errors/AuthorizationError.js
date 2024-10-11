import ApplicationError from "./ApplicationError.js";

export default class AuthorizationError extends ApplicationError {
	constructor(
		publicMessage = "Authorization failed",
		error,
		isSentErrorPublic = true,
		customErrorMessage = ""
	) {
		if (!error || !(error instanceof Error)) {
			error = new Error(customErrorMessage || publicMessage);
		}

		super(error, 403, publicMessage, isSentErrorPublic, customErrorMessage);
	}
}
