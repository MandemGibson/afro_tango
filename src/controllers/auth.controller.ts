import { NextFunction, Request, Response } from "express";
import {
  getUserByEmail,
  loginUser,
  signupUser,
  updatePassword,
} from "../services/auth.service";
import { generateToken } from "../utils/token";
import { hashPassword, validatePassword } from "../utils/password";
import { createOTP, findOTP, invalidateOTP } from "../services/otp.service";
import {
  createResetToken,
  findResetToken,
  invalidateResetToken,
} from "../services/resetToken.service";
import { sendOTPtoMail } from "../utils/nodemailer";

export const loginHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please enter both email and password" });
    }

    const user = await loginUser(email);

    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    if (user) {
      const isPasswordCorrect = await validatePassword(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid password" });
      }

      await generateToken(user.id, res);

      return res.status(200).json({
        message: "Login successful",
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        gender: user.gender,
        email: user.email,
        bio: user.bio,
        nationality: user.nationality,
        profilePic: user.profilePic,
        coverPic: user.coverPic,
        websiteLink: user.websiteLink,
        facebookLink: user.facebookLink,
        instagramLink: user.instagramLink,
        snapChatLink: user.snapChatLink,
        whatsAppLink: user.whatsAppLink,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const signupHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { email, password } = req.body;

    const userData = { email, password };

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    const userByEmail = await getUserByEmail(email);
    if (userByEmail) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const user = await signupUser(userData);

    await generateToken(user.id, res);

    res.status(201).json({ message: "User signed up successfully" });
  } catch (error) {
    next(error);
  }
};

export const getMeHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const user = req.user;
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      gender: user.gender,
      email: user.email,
      bio: user.bio,
      nationality: user.nationality,
      profilePic: user.profilePic,
      coverPic: user.coverPic,
      websiteLink: user.websiteLink,
      facebookLink: user.facebookLink,
      instagramLink: user.instagramLink,
      snapChatLink: user.snapChatLink,
      whatsAppLink: user.whatsAppLink,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error: any) {
    next(error);
  }
};

export const logoutHandler = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Sign out was successful" });
  } catch (error) {
    next(error);
  }
};

export const forgotPasswordHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { email } = req.body;
    const user = await getUserByEmail(email);

    if (!user) {
      return res
        .status(404)
        .json({ message: "No user associated with the provided email" });
    }

    const otp = await createOTP(user.id);
    if (otp) await sendOTPtoMail(otp, email);

    console.log(otp)
    res.status(200).json({ message: `OTP sent to ${email}` });
  } catch (error) {
    next(error);
  }
};

export const verifyOTPHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { otp } = req.body;

    if (!otp)
      return res.status(400).json({
        message: "Otp code is required",
      });

    const foundOtp = await findOTP(otp);

    if (!foundOtp) {
      return res.status(404).json({ message: "Invalid OTP" });
    }

    let resetToken = await findResetToken({ userId: foundOtp.userId });
    if (!resetToken) resetToken = await createResetToken(foundOtp.userId);

    await invalidateOTP(foundOtp.id);

    res.status(200).json({ token: resetToken?.token });
  } catch (error) {
    next(error);
  }
};

export const resetPasswordHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    let resetToken = await findResetToken({ token });
    if (!resetToken)
      return res.status(400).json({
        message: "Token invalid. Please request for an otp again",
      });

    if (confirmPassword !== newPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const hashedPassword = await hashPassword(newPassword);

    await updatePassword(resetToken.userId, hashedPassword);
    await invalidateResetToken(resetToken.id);

    res.status(200).json({ message: "Password reset was successful" });
  } catch (error) {
    next(error);
  }
};
