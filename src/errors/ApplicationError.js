export default class ApplicationError extends Error {
	constructor(
		error = new Error("Internal server error"), // Default to a generic error
		statusCode = 500, // Default HTTP status code
		publicMessage = "" // Public facing message
	) {
		// Ensure the passed error is an instance of Error, else create a default one
		if (!(error instanceof Error)) {
			error = new Error("Internal server error");
		}

		// Call the parent Error constructor with the error's message
		super(error.message);

		// Set the class name, status code, and public message
		this.name = this.constructor.name; // e.g., ApplicationError, AuthenticationError
		this.statusCode = statusCode;
		this.publicMessage = publicMessage || error.message;

		// Copy over all properties from the original error to the new one
		Object.assign(this, error);

		// If necessary, you can set a reference to the original error as well
		this.originalError = error;
	}
}
