import { Response } from "express";
import jwt from "jsonwebtoken";

export const generateToken = async (
  userId: string,
  res: Response,
  /*remeberMe: boolean */
) => {
  try {
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) throw new Error("Secret key is required");

    const token = await jwt.sign({ userId }, secretKey, {
      expiresIn: "1d",
    });

    await res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production"
    });

    // if (rememberMe) {
    //   await res.cookie("jwt", token, {
    //     httpOnly: true,
    //     maxAge: 7 * 24 * 60 * 60 * 1000,
    //     sameSite: "strict",
    //     secure: process.env.NODE_ENV === "production"
    //   });
    // }

    return token;
  } catch (error) {
    console.error(error)
    throw new Error("Error generating token");
  }
};

export const verifyToken = async (token: string) => {
  try {
    const secretKey = process.env.JWT_SECRET_KEY;
    if (!secretKey) throw new Error("Secret key is required");
    const decoded = await jwt.verify(token, secretKey);
    return decoded;
  } catch (error: any) {
    console.error(error)
    throw new Error("Error verifying token");
  }
};
