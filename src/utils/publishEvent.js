import { channel } from "../config/rabbitmq.js"; // Assuming channel is configured in the sharedlib
import { EXCHANGES, ROUTING_KEYS } from "../config/eventConfig.js";

export const publishEvent = async (eventName, data) => {
	try {
		const exchangeName = EXCHANGES[eventName.split("_")[0]]; // Derive exchange name (e.g., USER for USER_DELETED)
		const routingKey = ROUTING_KEYS[eventName]; // Get the routing key from the EVENTS constant

		if (!exchangeName || !routingKey) {
			throw new Error(
				`No exchange or routing key defined for event: ${eventName}`
			);
		}

		// Ensure the exchange exists
		await channel.assertExchange(exchangeName, "topic", { durable: true });

		// Publish the message to the exchange with the routing key
		await channel.publish(
			exchangeName,
			routingKey,
			Buffer.from(JSON.stringify(data))
		);

		console.log(
			`Event '${eventName}' published to exchange ${exchangeName} with routing key ${routingKey}`
		);
	} catch (error) {
		console.error(
			`Failed to publish event '${eventName}' to exchange ${exchangeName}:`,
			error
		);
		throw error; // Re-throw the error so that the calling function can handle it
	}
};
