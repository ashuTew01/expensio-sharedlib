import ApplicationError from "./ApplicationError.js";

export default class NotFoundError extends ApplicationError {
	constructor(
		publicMessage = "The requested resource was not found",
		error,
		customErrorMessage = ""
	) {
		if (!error || !(error instanceof Error)) {
			error = new Error(customErrorMessage || publicMessage);
		}

		super(error, 404, publicMessage, customErrorMessage);
	}
}
