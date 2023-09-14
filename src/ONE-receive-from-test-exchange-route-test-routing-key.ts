import amqp from 'amqplib';

async function receive() {

    const connection = await amqp.connect('amqp://localhost:5672');
    const channel = await connection.createChannel();

    const exchange = 'test-exchange';

    await channel.assertExchange(exchange, 'direct', { durable: false });

    const queue = await channel.assertQueue('', { exclusive: true });

    console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', 'key: test-routing-key-one');

    channel.bindQueue(queue.queue, exchange, 'test_routing_key_one');

    channel.consume(queue.queue, (message) => {
        console.log(" [x] %s: '%s'", message?.fields.routingKey, message?.content.toString());
    }, { noAck: true });



}

receive();