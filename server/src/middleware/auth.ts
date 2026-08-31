import { Request, Response, NextFunction } from "express";
import { supabase } from "../database/supabase";

declare global {
    namespace Express {
        interface Request {
            user?: { id: string; email?: string | undefined };
        }
    }
}

const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing or malformed Authorization header" });
    }

    const token = header.slice("Bearer ".length);
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }

    req.user = { id: data.user.id, email: data.user.email };
    next();
};

export { requireAuth };