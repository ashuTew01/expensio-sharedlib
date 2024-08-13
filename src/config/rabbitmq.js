import amqp from "amqplib";

let channel;

const connectRabbitMQ = async () => {
	if (!channel) {
		try {
			const connection = await amqp.connect(process.env.RABBITMQ_URL);
			channel = await connection.createChannel();
			console.log("Connected to RabbitMQ and channel created");
		} catch (error) {
			console.error("Failed to connect to RabbitMQ:", error);
			throw error;
		}
	}
	return channel;
};

export { connectRabbitMQ, channel };
