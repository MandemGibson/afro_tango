import crypto from "crypto";
import { PrismaService } from "./prisma.service";

const prisma = PrismaService;

export const createOTP = async (userId: string) => {
  try {
    const otp = crypto.randomInt(1000, 9999);
    const otpHash = crypto
      .createHash("sha256")
      .update(otp.toString())
      .digest("hex");

    await prisma.otp.create({
      data: {
        userId,
        otp: otpHash,
        expiresIn: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    return otp;
  } catch (error) {
    console.error("Error creating otp: ", error);
  }
};

export const findOTP = async (otp: number) => {
  try {
    const otpHash = crypto
      .createHash("sha256")
      .update(otp.toString())
      .digest("hex");

    const otpRecord = await prisma.otp.findFirst({
      where: {
        otp: otpHash,
        valid: true,
        expiresIn: { gt: new Date() },
      },
    });

    return otpRecord;
  } catch (error) {
    console.error("Error validating otp: ", error);
  }
};

export const invalidateOTP = async (id: string) => {
  try {
    await prisma.otp.update({
      where: { id },
      data: {
        valid: false,
      },
    });
  } catch (error) {
    console.error("Error invalidating otp: ", error);
  }
};
