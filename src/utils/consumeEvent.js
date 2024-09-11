import { logError, logInfo } from "../config/logger.js";

/**
 * Consumes events from Kafka and dispatches them to the appropriate handlers.
 * @param {Object} eventHandlers - An object where keys are event names and values are functions to handle those events.
 * @param {Array<String>} topics - Array of Kafka topics to consume from.
 * @param {Object} consumer - Kafka consumer instance.
 * @param {Object} producer - Kafka producer instance (for DLQ).
 * @returns {Promise<void>}
 */
export const consumeEvent = async (
	eventHandlers,
	topics,
	consumer,
	producer
) => {
	try {
		if (!eventHandlers || !topics || !consumer || !producer) {
			throw new Error(
				"Invalid arguments: eventHandlers, topics, consumer, or producer not provided."
			);
		}

		if (!process.env.SERVICE_NAME) {
			throw new Error("SERVICE_NAME not provided in environment variables.");
		}

		// Subscribe to all topics at once
		await consumer.subscribe({ topics, fromBeginning: false });

		// Run the consumer to listen for messages
		await consumer.run({
			eachMessage: async ({ topic, partition, message }) => {
				const key = message.key ? message.key.toString() : null;
				const value = JSON.parse(message.value.toString());

				// Only process if there's a matching event handler for the key (eventName)
				if (key && eventHandlers[key]) {
					logInfo(`Event Processing: ${key} from topic: ${topic}`);

					try {
						// Call the event handler with the entire message (parsed as JSON)
						await eventHandlers[key](value);

						logInfo(`Event Processed: ${key} from topic: ${topic}`);

						// Commit the offset after successful processing
						await consumer.commitOffsets([
							{
								topic,
								partition,
								offset: (Number(message.offset) + 1).toString(),
							},
						]);

						logInfo(`Offset committed for event: ${key}`);
					} catch (err) {
						logError(`Error processing event: ${key}. Sending to DLQ.`);

						// Send the failed event to the dead-letter topic
						const dlqTopic = `${topic}-dlq`;
						const dlqValue = {
							serviceName: process.env.SERVICE_NAME,
							error: err.message,
							value: value,
						};
						await producer.send({
							topic: dlqTopic,
							messages: [{ key, value: JSON.stringify(dlqValue) }],
						});

						logInfo(`Event sent to DLQ: ${dlqTopic}`);

						// Commit the offset even if the message failed
						await consumer.commitOffsets([
							{
								topic,
								partition,
								offset: (Number(message.offset) + 1).toString(),
							},
						]);

						logInfo(`Offset committed for event sent to DLQ: ${key}`);
						throw err;
					}
				}
			},
		});

		logInfo(`Subscribed to topics: ${topics.join(", ")}`);
	} catch (error) {
		logError(`Failed to consume event from Kafka: ${error.message}`);
		throw error;
	}
};
