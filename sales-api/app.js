import express from 'express';
import { connect } from './src/config/db/mongoDBConfig.js';
import { createInitialData } from './src/config/db/seeder.js';
import checkToken from './src/config/auth/checkToken.js';
import { connectRabbitMQ } from './src/config/rabbitmq/rabbitConfig.js';
import orderRoutes from './src/modules/sales/routes/OrderRoutes.js';

const app = express();
const env = process.env;
const PORT = env.PORT || 8082;

app.use(express.json());
connect();
createInitialData();
connectRabbitMQ();

app.use(checkToken);

app.get('/api/status', async (req, res) => {
    return res.status(200).json({
        service: "Sales-API",
        status: "up",
        httpStatus: 200
    });
});

app.listen(PORT, () => {
    console.log(`Server started successfully at port ${PORT}`);
});