import { channel } from "../config/rabbitmq.js";

const publishEvent = async (exchangeName, routingKey, data) => {
	try {
		await channel.assertExchange(exchangeName, "topic", { durable: true });
		await channel.publish(
			exchangeName,
			routingKey,
			Buffer.from(JSON.stringify(data))
		);
		console.log(
			`Event published to exchange ${exchangeName} with routing key ${routingKey}`
		);
	} catch (error) {
		console.error(
			`Failed to publish event to exchange ${exchangeName}:`,
			error
		);
		throw error;
	}
};

export { publishEvent };
