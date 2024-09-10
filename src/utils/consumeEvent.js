import { logError, logInfo } from "../config/logger.js";
import { EVENTS, TOPICS } from "../config/eventConfig.js";

/**
 * Consumes an event from Kafka
 * @param {String} eventName - Name of the event (Kafka key).
 * @param {String} topicName - Kafka topic to consume from.
 * @param {Function} onMessage - Function to call when the message is received.
 * @param {Object} consumer - Kafka consumer instance.
 * @returns {Promise<void>}
 */
export const consumeEvent = async (
	eventName,
	topicName,
	onMessage,
	consumer
) => {
	try {
		if (!eventName || !topicName || !onMessage || !consumer) {
			throw new Error(
				"Invalid arguments: eventName, topicName, onMessage, or consumer not provided."
			);
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
					logInfo(`Processing event: ${eventName} from topic: ${topic}`);

					// Pass the message to the onMessage callback
					await onMessage({
						key: key,
						message: JSON.parse(value), // Convert message value to an object
					});
				} else {
					logInfo(
						`Skipping message with key: ${key}. Expected key: ${eventName}`
					);
				}
			},
		});

		logInfo(`Subscribed to topic '${topicName}' for event '${eventName}'.`);
	} catch (error) {
		logError(`Failed to consume event from Kafka: ${error.message}`);
		throw error;
	}
};
