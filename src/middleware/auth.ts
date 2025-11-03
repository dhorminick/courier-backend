import { type Request, type Response, type NextFunction } from "express";
import { validateToken } from "../utils/index.js";

export interface AuthRequest extends Request {
  user?: string;
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];
  if (!token || token === null) {
    return res.status(401).json({ message: "Token Error" });
  }

  try {
    const decoded = validateToken(token);

    if (decoded.id) {
      req.user = decoded.id;
    }

    next();
  } catch (err) {
    console.error("Error:", err);
    return res
      .status(401)
      .json({ message: "Invalid or expired token", error: err });
  }
};
