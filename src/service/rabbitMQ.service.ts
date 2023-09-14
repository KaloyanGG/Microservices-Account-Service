import * as amqp from "amqplib";
import config from "../config/config";
import db_conn from "../database/connection";


export class RabbitMQService {
    private connection: amqp.Connection | null = null;
    private channel: amqp.Channel | null = null;

    private static instance: RabbitMQService;

    private constructor() { }
    static getInstance() {
        if (!RabbitMQService.instance) {
            RabbitMQService.instance = new RabbitMQService();
        }
        return RabbitMQService.instance;
    }

    async init() {
        try {
            this.connection = await amqp.connect(config.rabbitMQ.URL);
            this.channel = await this.connection.createChannel();
        } catch (error) {
            console.error("Error connecting to RabbitMQ: ", error);
            throw error;
        }
    }

    async startListener() {

        const rabbitMQConfig = config.rabbitMQ;

        const queueName = rabbitMQConfig.queue;
        const exchange = rabbitMQConfig.exchange;
        const pattern = rabbitMQConfig.pattern;


        if (this.channel === null) {
            console.error('RabbitMQ channel is not initialized.');
            return;
        }

        try {
            await this.channel.assertQueue(queueName, { durable: false });
            //durable?
            await this.channel.assertExchange(exchange, 'direct', { durable: false });
            // routing key = pattern
            await this.channel.bindQueue(queueName, exchange, pattern);

            this.channel.consume(queueName, async (message: amqp.ConsumeMessage | null) => {
                if (message !== null) {

                    const content: { amount: number, name: string } = JSON.parse(message.content.toString());

                    console.log(` 🐰 Received message from RabbitMQ: ${JSON.stringify(content)}`);

                    const queryReduce = 'UPDATE `account` a ' +
                        'SET a.balance = a.balance - ? ' +
                        'WHERE a.organization_id IN (SELECT o.registration_id FROM `organization` o WHERE o.`name` = ?)';

                    const queryIncrease = 'UPDATE `account` a ' +
                        'SET a.balance = a.balance + ? ' +
                        'WHERE a.organization_id IN (SELECT o.registration_id FROM `organization` o WHERE o.`name` = "ABC Corp")';

                    await db_conn.getConnection().promise()
                        .query(queryReduce, [content.amount, content.name]);

                    await db_conn.getConnection().promise()
                        .query(queryIncrease, [content.amount]);

                    console.log(` 💸 Updated account balance for ${content.name}!`);

                    this.channel!.ack(message); // Acknowledge that the message has been processed
                }
            }, { noAck: false });
        } catch (error) {
            console.error(`Error starting RabbitMQ listener: ${error}`);
        }
    }

    getChannel() {
        return RabbitMQService.instance.channel;
    }
    getConnection() {
        return RabbitMQService.instance.connection;
    }
    closeConnection() {
        RabbitMQService.instance.connection?.close();
    }
}

export default RabbitMQService.getInstance();

