import cors from "cors";

const corsMiddleware = cors({
    origin: [
        'http://localhost:5173',
        'https://invoice-app-lilac-theta.vercel.app'
    ]
});

export { corsMiddleware };