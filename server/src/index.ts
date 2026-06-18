import express from 'express';
import { configDotenv } from 'dotenv';
import { clientRouter } from './routes/clients';
import { serviceRouter } from './routes/services';
import { orderRouter } from './routes/orders';
import { invoiceRouter } from './routes/invoices';

configDotenv();

const app = express();
const port = Number(process.env.PORT);
const appName = String(process.env.APP_NAME);

app.use(express.json());

app.use('/client', clientRouter);
app.use('/service', serviceRouter);
app.use('/order', orderRouter);
app.use('/invoice', invoiceRouter);

app.listen(port, () => {
    return console.log(`${appName} is listening on port ${port}`);
})