import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const auth = (req: any, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token)
    return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    req.user = (decoded as jwt.JwtPayload).user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
