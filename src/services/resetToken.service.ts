import { PrismaService } from "./prisma.service";
import crypto from "crypto";
const prisma = PrismaService;

export const createResetToken = async (userId: string) => {
  try {
    const token = crypto.randomBytes(16).toString("hex");

    return await prisma.resetToken.create({
      data: {
        userId,
        token,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
      select: {
        id: true,
        userId: true,
        token: true,
      },
    });
  } catch (error) {
    console.error(error);
  }
};

export const findResetToken = async (filter: object) => {
  try {
    return await prisma.resetToken.findFirst({
      where: {
        ...filter,
        valid: true,
        expiresAt: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
        userId: true,
        token: true,
      },
    });
  } catch (error) {
    console.error(error);
  }
};

export const invalidateResetToken = async (id: string) => {
  try {
     await prisma.resetToken.update({
      where: {
        id,
      },
      data: {
        valid: false,
      },
    });
  } catch (error) {
    console.error(error);
  }
};
