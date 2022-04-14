import express from 'express';
import * as seeder from './src/config/db/seeder.js';
import UserRoutes from './src/modules/user/routes/UserRoutes.js';
import HTTP_CODE from './src/config/constants/httpStatus.js';
import checkToken from './src/config/auth/checkToken.js';

const app = express();
const env = process.env;
const PORT = env.PORT || 8080;

//await seeder.createInitialData();

app.use(express.json());
app.use(UserRoutes);

app.get("/api/status", (req, res) => {
    return res.status(200).json({
        service: "Auth-API",
        status: "up",
        httpStatus: 200
    });
});

app.listen(PORT, () => {
    console.info(`Server started success at port ${PORT}`);
});