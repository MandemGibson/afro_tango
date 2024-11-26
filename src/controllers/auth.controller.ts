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

//This is the login handler and it just gets the email, password and remember me
//from the request body and sends the user's information
export const loginHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { email, password, rememberMe } = req.body;
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
      //Here we are just comparing the password from the request to the hashed password
      //stored in the database.. you could check the utils folder
      const isPasswordCorrect = await validatePassword(password, user.password);
      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid password" });
      }

      //if there is a user and password is correct we generate a token so the
      //frontend devs could use to keep the user logged in when the /me endpoint is fetched
      await generateToken(user.id, res, rememberMe);

      return res.status(200).json({
        message: "Login successful",
        id: user.id,
        name: user.name,
        email: user.email,
        birthdate: user.birthdate,
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
    const {
      email,
      password,
      confirmPassword,
      name,
      birthdate,
      gender,
      guardianName,
      guardianEmail,
      guardianPhone,
      rememberMe,
    } = req.body;

    const userData = { email, password, name, birthdate, gender };
    const guardianData = { guardianName, guardianEmail, guardianPhone };

    if (
      !email ||
      !password ||
      !confirmPassword ||
      !name ||
      !birthdate ||
      !gender ||
      !guardianName ||
      !guardianEmail ||
      !guardianPhone
    ) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    if (confirmPassword !== password) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const userByEmail = await getUserByEmail(email);
    if (userByEmail) {
      return res.status(409).json({ message: "Email already exists" });
    }

    const user = await signupUser(userData, guardianData);

    await generateToken(user.id, res, rememberMe);

    res.status(201).json({
      message: "User signed up successfully",
      id: user.id,
      name: user.name,
      email: user.email,
      birthdate: user.birthdate,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
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
      name: user.name,
      email: user.email,
      birthdate: user.birthdate,
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
