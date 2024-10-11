import ApplicationError from "./ApplicationError.js";

export default class InternalServerError extends ApplicationError {
	constructor(
		publicMessage = "Internal server error",
		error,
		customErrorMessage = ""
	) {
		if (!error || !(error instanceof Error)) {
			error = new Error(publicMessage);
		}

		super(error, 500, publicMessage, customErrorMessage);
	}
}
