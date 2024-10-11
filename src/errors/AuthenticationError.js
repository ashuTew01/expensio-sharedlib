import ApplicationError from "./ApplicationError.js";

export default class AuthenticationError extends ApplicationError {
	constructor(message = "Authentication failed", error, publicMessage = "") {
		// Ensure error is an instance of Error, otherwise create a default one
		if (!error || !(error instanceof Error)) {
			error = new Error(message);
		}

		// Default the publicMessage to the message if not provided
		publicMessage = publicMessage || message;

		// Pass the error, statusCode (401 for authentication), and publicMessage to the parent class
		super(error, 401, publicMessage);
	}
}
