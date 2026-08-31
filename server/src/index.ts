import express from 'express';
import { configDotenv } from 'dotenv';
import { clientRouter } from './routes/clients';
import { serviceRouter } from './routes/services';
import { orderRouter } from './routes/orders';
import { invoiceRouter } from './routes/invoices';
import { corsMiddleware } from './middleware/cors';
import { errorHandler } from './middleware/errorHandler';
import { pdfRouter } from './routes/pdf';
import { authRouter } from './routes/auth';
import { requireAuth } from './middleware/auth';

configDotenv();

const app = express();
const port = Number(process.env.PORT);
const appName = String(process.env.APP_NAME);

app.use(corsMiddleware);
app.use(express.json());

app.use("/auth", authRouter);

app.use('/clients', clientRouter);
app.use('/services', serviceRouter);
app.use('/orders', orderRouter);
app.use('/invoices', invoiceRouter);
app.use("/invoices", requireAuth, pdfRouter);

app.use(errorHandler);

app.listen(port, () => {
    return console.log(`${appName} is listening on port ${port}`);
})