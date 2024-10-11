import ApplicationError from "../ApplicationError.js";

export default class OtpSendingError extends ApplicationError {
	constructor(
		publicMessage = "Error sending OTP.",
		error,
		isSentErrorPublic = true,
		customErrorMessage = ""
	) {
		if (!error || !(error instanceof Error)) {
			error = new Error(customErrorMessage || publicMessage);
		}

		super(error, 503, publicMessage, isSentErrorPublic, customErrorMessage);
	}
}
