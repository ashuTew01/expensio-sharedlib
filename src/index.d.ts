// index.d.ts

declare module "@expensio/sharedlib" {
	export class ApplicationError extends Error {
		constructor(message: string, statusCode: number);
		name: string;
		statusCode: number;
	}

	export class AuthorizationError extends ApplicationError {
		constructor(message?: string);
	}

	export class DatabaseError extends ApplicationError {
		constructor(message?: string);
	}

	export class NotFoundError extends ApplicationError {
		constructor(message?: string);
	}

	export class ValidationError extends ApplicationError {
		constructor(message?: string);
	}

	export class OtpSendingError extends ApplicationError {
		constructor(message?: string);
	}

	export class RateLimitError extends ApplicationError {
		constructor(message?: string);
	}

	export class AuthenticationError extends ApplicationError {
		constructor(message?: string);
	}

	export class InternalServerError extends ApplicationError {
		constructor(message?: string);
	}

	export function errorHandlingMiddleware(
		err: any,
		req: any,
		res: any,
		next: any
	): void;

	export function authMiddleware(req: any, res: any, next: any): void;
}
