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
	export const TOPICS: { [key: string]: string };
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

	/**
	 * Produce an event to Kafka
	 * @param {String} eventName - Name of the event. (Key for Kafka)
	 * @param {Object} data - The event payload.
	 * @param {String} eventId - Unique identifier for the event.
	 * @param {String} topicName - Kafka topic to publish to.
	 * @param {Object} producer - Kafka producer instance.
	 * @returns {Promise<void>}
	 */
	export function produceEvent(
		eventName: string,
		data: object,
		eventId: string,
		topicName: string,
		producer: object
	): Promise<void>;

	/**
	 * Consumes an event from Kafka
	 * @param {String} eventName - Name of the event (Kafka key).
	 * @param {String} topicName - Kafka topic to consume from.
	 * @param {Function} onMessage - Function to call when the message is received.
	 * @param {Object} consumer - Kafka consumer instance.
	 * @returns {Promise<void>}
	 */
	export function consumeEvent(
		eventName: string,
		topicName: string,
		onMessage: (data: any) => void,
		consumer: object
	): Promise<void>;
}
