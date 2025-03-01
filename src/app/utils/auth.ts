import jwt from "jsonwebtoken";

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
  } catch (error) {
    return null;
  }
}
