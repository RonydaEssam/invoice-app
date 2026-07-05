import cors from "cors";

const corsMiddleware = cors({
    origin: [
        'http://localhost:5173',
        'https://storied-dango-1049ec.netlify.app/'
    ]
});

export { corsMiddleware };