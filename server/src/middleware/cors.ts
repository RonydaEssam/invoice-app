import cors from "cors";

const corsMiddleware = cors({
    origin: [
        'http://localhost:5173',
        'https://invoice-generator-app1.netlify.app'
    ]
});

export { corsMiddleware };