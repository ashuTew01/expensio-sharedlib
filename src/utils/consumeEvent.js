import { logError, logInfo } from "../config/logger.js";
import { EVENTS, TOPICS } from "../config/eventConfig.js";
import { produceEvent } from "./produceEvent.js"; // Assuming the produceEvent function is defined to handle Kafka event production

/**
 * Consumes an event from Kafka
 * @param {String} eventName - Name of the event (Kafka key).
 * @param {String} topicName - Kafka topic to consume from.
 * @param {Function} onMessage - Function to call when the message is received.
 * @param {Object} consumer - Kafka consumer instance.
 * @param {Object} producer - Kafka producer instance for sending to DLQ.
 * @requires {process.env.SERVICE_NAME}
 * @returns {Promise<void>}
 */
export const consumeEvent = async (
	eventName,
	topicName,
	onMessage,
	consumer,
	producer
) => {
	try {
		if (!eventName || !topicName || !onMessage || !consumer || !producer) {
			throw new Error(
				"Invalid arguments: eventName, topicName, onMessage, consumer, or producer not provided."
			);
		}

		if (!process.env.SERVICE_NAME) {
			throw new Error("SERVICE_NAME not provided in environment variables.");
		}

		// Check if the eventName is valid.
		const validEvents = Object.values(EVENTS);
		if (!validEvents.includes(eventName)) {
			const availableEvents = validEvents.join(", ");
			throw new Error(
				`Invalid event name '${eventName}'. Available events are: ${availableEvents}`
			);
		}

		// Check if the topicName is valid.
		const validTopics = Object.values(TOPICS);
		if (!validTopics.includes(topicName)) {
			const availableTopics = validTopics.join(", ");
			throw new Error(
				`Invalid topic name '${topicName}'. Available topics are: ${availableTopics}`
			);
		}

		// Subscribe to the topic
		await consumer.subscribe({ topic: topicName, fromBeginning: false });

		// Run the consumer to listen for messages
		await consumer.run({
			eachMessage: async ({ topic, partition, message }) => {
				const key = message.key ? message.key.toString() : null;
				const value = message.value.toString();

				// Only process messages that match the eventName (key)
				if (key === eventName) {
					logInfo(`Event Processing: ${eventName} from topic: ${topic}`);

					try {
						// Process the message
						await onMessage({
							key: key,
							message: JSON.parse(value), // Convert message value to an object
						});

						logInfo(`Event Processed: ${eventName} from topic: ${topic}`);

						// Commit the offset after successful processing
						await consumer.commitOffsets([
							{
								topic,
								partition,
								offset: (Number(message.offset) + 1).toString(),
							},
						]);
						logInfo(`Offset committed for event: ${eventName}`);
					} catch (err) {
						logError(`Error processing event: ${eventName}. Sending to DLQ.`);

						// Send the failed event to the dead-letter topic
						const dlqTopic = `${process.env.SERVICE_NAME}-events-dlq`;
						await produceEvent(
							eventName,
							JSON.parse(value),
							dlqTopic,
							producer
						);

						logInfo(`Event sent to DLQ: ${dlqTopic}`);

						// Commit the offset even if the message failed
						await consumer.commitOffsets([
							{
								topic,
								partition,
								offset: (Number(message.offset) + 1).toString(),
							},
						]);
						logInfo(`Offset committed for event sent to DLQ: ${eventName}`);
					}
				}
			},
		});

		logInfo(`Subscribed to '${eventName}' from topic '${topicName}'.`);
	} catch (error) {
		logError(`Failed to consume event from Kafka: ${error.message}`);
		throw error;
	}
};
