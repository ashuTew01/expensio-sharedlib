import ApplicationError from "./ApplicationError.js";

export default class AuthorizationError extends ApplicationError {
	constructor(message = "Authorization failed", error, publicMessage = "") {
		if (!error || !(error instanceof Error)) {
			error = new Error(message);
		}
		publicMessage = publicMessage || message;

		super(error, 403, publicMessage);
	}
}
