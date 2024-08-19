// index.d.ts

declare module "@expensio/sharedlib" {
	// Errors
	export class ApplicationError extends Error {
		constructor(message: string);
	}
	export class AuthorizationError extends Error {
		constructor(message: string);
	}
	export class DatabaseError extends Error {
		constructor(message: string);
	}
	export class NotFoundError extends Error {
		constructor(message: string);
	}
	export class ValidationError extends Error {
		constructor(message: string);
	}
	export class OtpSendingError extends Error {
		constructor(message: string);
	}
	export class RateLimitError extends Error {
		constructor(message: string);
	}
	export class AuthenticationError extends Error {
		constructor(message: string);
	}
	export class InternalServerError extends Error {
		constructor(message: string);
	}

	// Middlewares
	export function errorHandlingMiddleware(
		err: Error,
		req: any,
		res: any,
		next: any
	): void;
	export function authMiddleware(req: any, res: any, next: any): void;

	// Logger
	export function initLogger(logDirectory: string): void;
	export function getLogger(): any;
	export function logError(message: string): void;
	export function logWarning(message: string): void;
	export function logInfo(message: string): void;

	// Event Config
	export const EVENTS: { [key: string]: string };
	export const EXCHANGES: { [key: string]: string };
	export const ROUTING_KEYS: { [key: string]: string };

	// Event Functions
	export function publishEvent(
		eventName: string,
		data: any,
		channel: any
	): Promise<void>;
	export function subscribeEvent(
		eventName: string,
		queueName: string,
		onMessage: (data: any) => void,
		channel: any
	): Promise<void>;
}
