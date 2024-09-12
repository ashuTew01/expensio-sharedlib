import { EVENTS } from "@expensio/sharedlib";
import { logError, logInfo } from "../config/logger.js";
import { TOPICS } from "../config/eventConfig.js";
// import { v4 as uuidv4 } from "uuid";
/**
 * Produce an event to Kafka
 * @param {String} eventName - Name of the event. (Key for Kafka)
 * @param {Object} data - The event payload.
 * @param {String} topicName - Kafka topic to publish to.
 * @param {Object} producer - Kafka producer instance.
 * @returns {Promise<void>}
 */
export const produceEvent = async (
	eventName,
	data,
	topicName,
	producer
	// eventId = uuidv4()
) => {
	try {
		if (!eventName || !data || !topicName || !producer) {
			throw new Error("Some parameters missing...");
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
		if (!topicName || !validTopics.includes(topicName)) {
			const availableTopics = validTopics.join(", ");
			throw new Error(
				`Invalid topic name '${topicName}'. Available topics are: ${availableTopics}`
			);
		}

		// //Prepare message with eventID.
		// const message = {
		// 	eventId,
		// 	data,
		// };

		// Send message to Kafka topic
		await producer.send({
			topic: topicName,
			messages: [{ key: eventName, value: JSON.stringify(data) }],
		});

		logInfo(`Event Produced: '${eventName}' to topic '${topicName}'.`);
	} catch (error) {
		logError(`Failed to produce event to Kafka: ${error.message}`);
		throw error;
	}
};
