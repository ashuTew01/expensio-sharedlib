declare module "@expensio/sharedlib" {
	export { default as ApplicationError } from "./errors/ApplicationError.js";
	export { default as AuthorizationError } from "./errors/AuthorizationError.js";
	export { default as DatabaseError } from "./errors/DatabaseError.js";
	export { default as NotFoundError } from "./errors/NotFoundError.js";
	export { default as ValidationError } from "./errors/ValidationError.js";
	export { default as OtpSendingError } from "./errors/otp/OtpSendingError.js";
	export { default as RateLimitError } from "./errors/otp/RateLimitError.js";
	export { default as AuthenticationError } from "./errors/AuthenticationError.js";
	export { default as InternalServerError } from "./errors/InternalServerError.js";
	export { default as errorHandlingMiddleware } from "./middlewares/errorHandlingMiddleware.js";
	export { default as authMiddleware } from "./middlewares/authMiddleware.js";
}
