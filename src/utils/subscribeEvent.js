import { EXCHANGES, ROUTING_KEYS } from "../config/eventConfig.js";
import { logError, logInfo, logWarning } from "../config/logger.js";

const MAX_RETRIES = 5;
const ACK_TIMEOUT = 30000; // 30 seconds timeout

export const subscribeEvent = async (
	eventName,
	queueName,
	onMessage,
	channel
) => {
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

		// Ensure the DLX exchange exists
		await channel.assertExchange("event-bus-dlx", "topic", { durable: true });

		// Ensure the queue exists with DLX configuration
		const q = await channel.assertQueue(queueName, {
			durable: true,
			arguments: {
				"x-dead-letter-exchange": "event-bus-dlx", // Specify the DLX
				"x-dead-letter-routing-key": queueName + ".failed", // Optional routing key for DLX
			},
		});

		// Ensure the DLX queue exists
		await channel.assertQueue(queueName + ".failed", { durable: true });

		// Bind the queue to the exchange with the routing key
		await channel.bindQueue(q.queue, exchangeName, routingKey);

		// Bind the DLX queue to the DLX exchange
		await channel.bindQueue(queueName + ".failed", "event-bus-dlx", "#");

		// Set prefetch count to 1 to ensure only one message is delivered at a time per consumer
		await channel.prefetch(1);

		// Consume the messages
		channel.consume(q.queue, async (msg) => {
			if (msg !== null) {
				const retryCount = msg.properties.headers["x-retry-count"] || 0;
				let timeoutHandler;

				try {
					// Set up a timeout to automatically nack the message after 30 seconds
					timeoutHandler = setTimeout(async () => {
						logWarning(
							`Message from event '${eventName}' timed out after ${ACK_TIMEOUT / 1000} seconds. Requeuing... (${retryCount + 1}/${MAX_RETRIES})`
						);

						if (retryCount < MAX_RETRIES) {
							// Increment retry count and requeue the message
							channel.nack(msg, false, false); // Reject the original message

							await channel.sendToQueue(q.queue, msg.content, {
								headers: { "x-retry-count": retryCount + 1 },
								persistent: true,
							});
						} else {
							// Max retries reached, send to DLX
							logError(
								`Message from event '${eventName}' failed after ${MAX_RETRIES} retries. Sending to DLX.`
							);
							channel.nack(msg, false, false); // Reject without requeueing
						}
					}, ACK_TIMEOUT);

					// Process the message
					await onMessage(JSON.parse(msg.content.toString()));

					// Clear the timeout if the message is processed successfully
					clearTimeout(timeoutHandler);

					channel.ack(msg); // Acknowledge message upon successful processing
				} catch (error) {
					clearTimeout(timeoutHandler);

					if (retryCount < MAX_RETRIES) {
						logWarning(
							`Error processing message from event '${eventName}': ${error.message}. Requeuing... (${retryCount + 1}/${MAX_RETRIES})`
						);

						// Manually requeue the message with incremented retry count
						channel.nack(msg, false, false); // Reject the original message
						await channel.sendToQueue(q.queue, msg.content, {
							headers: { "x-retry-count": retryCount + 1 },
							persistent: true,
						});
					} else {
						logError(
							`Message from event '${eventName}' failed after ${MAX_RETRIES} retries. Sending to DLX.`
						);
						channel.nack(msg, false, false); // Reject without requeueing
					}
				}
			}
		});

		logInfo(
			`Subscribed to event '${eventName}' on queue '${queueName}' with routing key '${routingKey}'`
		);
	} catch (error) {
		logError(
			`Failed to subscribe to event '${eventName}' on queue '${queueName}': ${error.message}`
		);
		throw error;
	}
};

// code to consume dlx
// const consumeDLQ = async () => {
//     const channel = await connectRabbitMQ();
//     const queueName = 'your-queue-name.failed'; // The DLQ name

//     await channel.consume(queueName, async (msg) => {
//         if (msg !== null) {
//             const messageContent = JSON.parse(msg.content.toString());
//             console.log('Received message from DLQ:', messageContent);

//             // Process the message or take appropriate actions
//             // Example: Retry processing, alerting, logging, etc.

//             channel.ack(msg); // Acknowledge after processing
//         }
//     });
// };

// consumeDLQ().catch(console.error);
