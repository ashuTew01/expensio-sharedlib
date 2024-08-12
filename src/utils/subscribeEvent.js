import { channel } from "../config/rabbitmq.js";
import { EXCHANGES, ROUTING_KEYS } from "../config/eventConfig.js";

export const subscribeEvent = async (eventName, queueName, onMessage) => {
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

		// Ensure the queue exists
		const q = await channel.assertQueue(queueName, { durable: true });

		// Bind the queue to the exchange with the routing key
		await channel.bindQueue(q.queue, exchangeName, routingKey);

		// Set prefetch count to 1 to ensure only one message is delivered at a time per consumer
		await channel.prefetch(1);

		// Consume the messages
		channel.consume(q.queue, async (msg) => {
			if (msg !== null) {
				try {
					await onMessage(JSON.parse(msg.content.toString()));
					channel.ack(msg); // Acknowledge message upon successful processing
				} catch (error) {
					console.error(
						`Error processing message from event '${eventName}':`,
						error
					);
					channel.nack(msg, false, false); // Reject the message permanently
				}
			}
		});

		console.log(
			`Subscribed to event '${eventName}' on queue '${queueName}' with routing key '${routingKey}'`
		);
	} catch (error) {
		console.error(
			`Failed to subscribe to event '${eventName}' on queue '${queueName}':`,
			error
		);
		throw error; // Re-throw the error so that the calling function can handle it
	}
};
