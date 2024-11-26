import { User } from "../entity";
import { hashPassword } from "../utils/password";
import { PrismaService } from "./prisma.service";
const prisma = PrismaService;

export const getAllUsers = async () => {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    console.error(error);
    throw new Error("Error getting all users");
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    return user;
  } catch (error) {
    console.error(error);
    throw new Error("Error getting user by id");
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    return user;
  } catch (error) {
    console.error(error);
    throw new Error("Error getting user by email");
  }
};

export const loginUser = async (email: string) => {
  try {
    const user = await getUserByEmail(email);
    return user;
  } catch (error) {
    console.error(error);
    throw new Error("Error in auth service: loginUser");
  }
};

export const signupUser = async (userData: User) => {
  try {
    const { email, password } = userData;

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return user;
  } catch (error: any) {
    console.error(error);
    throw new Error("Error in auth service: signupUser");
  }
};

export const updatePassword = async (userId: string, password: string) => {
  try {
    return await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Error in auth service: updatePassword");
  }
};
