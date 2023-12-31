import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

export default {
    host: process.env.HOST || 'localhost',
    port: process.env.PORT || 8000,
    db: {
        HOST: process.env.DB_HOST || 'localhost',
        USER: process.env.DB_USER || 'koko',
        PASSWORD: process.env.DB_PASSWORD || '',
        DATABASE: process.env.DB_DATABASE || 'sakilaa',
        PORT: process.env.DB_PORT as any || 3306,
    },
    rabbitMQ: {
        URL: process.env.RABBITMQ_URL || 'amqp://localhost:5672',
        queue: process.env.RABBITMQ_QUEUE || 'hello',
        exchange: process.env.RABBITMQ_EXCHANGE || 'test-exchange',
        pattern: process.env.RABBITMQ_PATTERN || 'test_routing_key_one',
    },
};
