// index.d.ts

declare module "@expensio/sharedlib" {
	// Errors
	// export class ApplicationError extends Error {
	// 	constructor(message: string);
	// }
	export class AuthorizationError extends Error {
		constructor(
			publicMessage?: string,
			error?: Error,
			customErrorMessage?: string
		);
	}
	export class DatabaseError extends Error {
		constructor(
			publicMessage?: string,
			error?: Error,
			customErrorMessage?: string
		);
	}
	export class NotFoundError extends Error {
		constructor(
			publicMessage?: string,
			error?: Error,
			customErrorMessage?: string
		);
	}
	export class ValidationError extends Error {
		constructor(
			publicMessage?: string,
			error?: Error,
			customErrorMessage?: string
		);
	}
	export class OtpSendingError extends Error {
		constructor(
			publicMessage?: string,
			error?: Error,
			customErrorMessage?: string
		);
	}
	export class RateLimitError extends Error {
		constructor(
			publicMessage?: string,
			error?: Error,
			customErrorMessage?: string
		);
	}
	export class AuthenticationError extends Error {
		constructor(
			publicMessage?: string,
			error?: Error,
			customErrorMessage?: string
		);
	}
	export class InternalServerError extends Error {
		constructor(
			publicMessage?: string,
			error?: Error,
			customErrorMessage?: string
		);
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

	/**
	 * Logs a message with error level.
	 *
	 * @param {string} message The message to log.
	 * @param {Object} [options] Additional options for the log message.
	 *      - transport: The transport to use for logging.
	 *      - level: The level of the log message.
	 *      - label: The label of the log message.
	 *      - timestamp: The timestamp of the log message.
	 *      - json: The JSON payload of the log message.
	 *      - metadata: Additional metadata for the log message.
	 *      - depth: The depth of the log message.
	 *      - formatter: The formatter to use for the log message.
	 *      - raw: The raw log message.
	 *      - stack: The stack trace of the log message.
	 *      - error: The error object that triggered the log message.
	 */
	export function logError(message: string, options?: object): void;

	/**
	 * Logs a message with warning level.
	 *
	 * @param {string} message The message to log.
	 * @param {Object} [options] Additional options for the log message.
	 *      - transport: The transport to use for logging.
	 *      - level: The level of the log message.
	 *      - label: The label of the log message.
	 *      - timestamp: The timestamp of the log message.
	 *      - json: The JSON payload of the log message.
	 *      - metadata: Additional metadata for the log message.
	 *      - depth: The depth of the log message.
	 *      - formatter: The formatter to use for the log message.
	 *      - raw: The raw log message.
	 *      - stack: The stack trace of the log message.
	 *      - error: The error object that triggered the log message.
	 */
	export function logWarning(message: string, options?: object): void;

	/**
	 * Logs a message with info level.
	 *
	 * @param {string} message The message to log.
	 * @param {Object} [options] Additional options for the log message.
	 *      - transport: The transport to use for logging.
	 *      - level: The level of the log message.
	 *      - label: The label of the log message.
	 *      - timestamp: The timestamp of the log message.
	 *      - json: The JSON payload of the log message.
	 *      - metadata: Additional metadata for the log message.
	 *      - depth: The depth of the log message.
	 *      - formatter: The formatter to use for the log message.
	 *      - raw: The raw log message.
	 *      - stack: The stack trace of the log message.
	 *      - error: The error object that triggered the log message.
	 */
	export function logInfo(message: string, options?: object): void;

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
	 * @param {String} topicName - Kafka topic to publish to.
	 * @param {Object} producer - Kafka producer instance.
	 * @returns {Promise<void>}
	 */
	export function produceEvent(
		eventName: string,
		data: any,
		topicName: string,
		producer: object
	): Promise<void>;

	/**
	 * Consumes events from Kafka and dispatches them to the appropriate handlers.
	 * @param {Object} eventHandlers - An object where keys are event names and values are functions to handle those events.
	 * @param {Array<String>} topics - Array of Kafka topics to consume from.
	 * @param {Object} consumer - Kafka consumer instance.
	 * @param {Object} producer - Kafka producer instance (for DLQ).
	 * @returns {Promise<void>}
	 */
	export function consumeEvent(
		eventHandlers: object,
		topics: string[],
		consumer: object,
		producer: object
	): Promise<void>;

	/**
	 * Prints the Expensio logo to the console.
	 * @returns {void}
	 */
	export function showLogo(): void;
}
