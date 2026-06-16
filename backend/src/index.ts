import express from 'express';
import { configDotenv } from 'dotenv';

configDotenv();

const app = express();
const port = Number(process.env.PORT);
const appName = String(process.env.APP_NAME);

app.use(express.json());

app.listen(port, () => {
    return console.log(`${appName} is listening on port ${port}`);
})