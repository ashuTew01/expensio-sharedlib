declare module "@expensio/sharedlib" {
	export * from "./errors/ApplicationError";
	export * from "./errors/AuthorizationError";
	export * from "./errors/DatabaseError";
	export * from "./errors/NotFoundError";
	export * from "./errors/ValidationError";
	export * from "./errors/otp/OtpSendingError";
	export * from "./errors/otp/RateLimitError";
	export * from "./errors/AuthenticationError";
	export * from "./errors/InternalServerError";
	export * from "./middlewares/errorHandlingMiddleware";
	export * from "./middlewares/authMiddleware";
}
