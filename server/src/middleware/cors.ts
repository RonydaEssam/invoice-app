import cors from "cors";

const corsMiddleware = cors({
    origin: [
        'http://localhost:5173',
        'https://your-app.netlify.app'
    ]
});

export { corsMiddleware };