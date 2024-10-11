import ApplicationError from "./ApplicationError.js";

export default class InternalServerError extends ApplicationError {
	constructor(
		publicMessage = "Internal server error",
		error,
		isSentErrorPublic = true,
		customErrorMessage = ""
	) {
		if (!error || !(error instanceof Error)) {
			error = new Error(customErrorMessage || publicMessage);
		}

		super(error, 500, publicMessage, isSentErrorPublic, customErrorMessage);
	}
}
