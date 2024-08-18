import { EXCHANGES, ROUTING_KEYS, EVENTS } from "../config/eventConfig.js";
import { logError, logInfo } from "../config/logger.js";

export const publishEvent = async (eventName, data, channel) => {
	try {
		const validEvents = Object.values(EVENTS);
		console.log("PublishEvent Log: 1");
		// Check if the eventName is valid.
		if (!validEvents.includes(eventName)) {
			const availableEvents = validEvents.join(", ");
			throw new Error(
				`Invalid event name '${eventName}'. Available events are: ${availableEvents}`
			);
		}
		console.log("PublishEvent Log: 2");

		const exchangeName = EXCHANGES[eventName.split("_")[0]]; // Derive exchange name (e.g., USER for USER_DELETED)
		const routingKey = ROUTING_KEYS[eventName]; // Get the routing key from the EVENTS constant
		console.log("PublishEvent Log: 3");

		if (!exchangeName) {
			logError(
				`Exchange name for event '${eventName}' not found. Available exchanges: ${JSON.stringify(EXCHANGES)}`
			);
			throw new Error(`No exchange defined for event: ${eventName}`);
		}

		if (!routingKey) {
			logError(
				`Routing key for event '${eventName}' not found. Available routing keys: ${JSON.stringify(ROUTING_KEYS)}`
			);
			throw new Error(`No routing key defined for event: ${eventName}`);
		}
		console.log("PublishEvent Log: 4");

		// Ensure the exchange exists
		await channel.assertExchange(exchangeName, "topic", { durable: true });

		// Publish the message to the exchange with the routing key
		await channel.publish(
			exchangeName,
			routingKey,
			Buffer.from(JSON.stringify(data))
		);
		console.log("PublishEvent Log: 5");

		logInfo(
			`Event '${eventName}' published to exchange ${exchangeName} with routing key ${routingKey}`
		);
	} catch (error) {
		console.log("PublishEvent Log: 6");

		logError(
			`Failed to publish event '${eventName}' to exchange ${exchangeName}:`,
			error
		);
		throw error; // Re-throw the error so that the calling function can handle it
	}
};
