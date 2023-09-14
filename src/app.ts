import express, { Request, Response, Express } from 'express';
import dotenv from 'dotenv';
import dbConn from './database/connection';
import config from './config/config';
import registerRoutes from './routes/routes';
import rabbitMQService from './service/rabbitMQ.service';

const app: Express = express();

dotenv.config();
const [host, port] = [config.host, config.port];

app.use(express.json()); // Add this middleware to parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Add this middleware to parse URL-encoded bodies

app.listen(port, async () => {
    try {
        registerRoutes(app);
        await dbConn.checkConnection();
        console.log(' 📚 Database connected!');
        await rabbitMQService.init();
        console.log(' 🐇 RabbitMQ connected!');
        await rabbitMQService.startListener();
        //??
        console.log(` 🐇 RabbitMQ listener started in ${config.rabbitMQ.queue} queue!`);
        console.log(` ⚡️ Account service is running at http://${host}:${port}`);

        // startReceivingMessages('hello');

    } catch (e: any) {
        console.log(` ❌ Error: ${e.message}`);
        throw e;
    }
});


