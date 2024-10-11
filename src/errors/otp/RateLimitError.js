import ApplicationError from "../ApplicationError.js";

export default class RateLimitError extends ApplicationError {
	constructor(
		publicMessage = "Rate Limit exceeded.",
		error,
		isSentErrorPublic = true,
		customErrorMessage = ""
	) {
		if (!error || !(error instanceof Error)) {
			error = new Error(customErrorMessage || publicMessage);
		}

		super(error, 429, publicMessage, isSentErrorPublic, customErrorMessage);
	}
}
