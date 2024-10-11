import ApplicationError from "./ApplicationError.js";

export default class InternalServerError extends ApplicationError {
	constructor(message = "Internal server error", error, publicMessage = "") {
		if (!error || !(error instanceof Error)) {
			error = new Error(message);
		}
		publicMessage = publicMessage || message;

		super(error, 500, publicMessage);
	}
}
