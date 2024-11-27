import { NextFunction, Request, Response } from "express";
import { User } from "../entity";
import { verifyToken } from "../utils/token";
import { JwtPayload } from "jsonwebtoken";
import { getAllUsers } from "../services/user.service";

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

export const protectedRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const token = await req.cookies.jwt;
    console.log("Token: ",token);
    
    
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token found" });
    }
    const decoded = (await verifyToken(token)) as JwtPayload;
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
    const users = await getAllUsers();

    const user = users?.find((user) => user.id === decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized - No user found" });
    }

    req.user = user;

    next();
  } catch (error: any) {
    next(error);
  }
};
