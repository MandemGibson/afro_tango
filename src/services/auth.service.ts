import { User } from "../entity";
import { hashPassword } from "../utils/password";
import { PrismaService } from "./prisma.service";
import { getUserByEmail } from "./user.service";
const prisma = PrismaService;

export const loginUser = async (email: string): Promise<User | null> => {
  try {
    return await getUserByEmail(email);
  } catch (error) {
    console.error(error);
    throw new Error("Error in auth service: loginUser");
  }
};

export const signupUser = async (userData: User): Promise<User> => {
  try {
    const { email, password } = userData;

    const hashedPassword = await hashPassword(password as string);

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error("Email already exists");
    }

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

export const updatePassword = async (
  userId: string,
  password: string
): Promise<User> => {
  try {
    const hashedPassword = await hashPassword(password);

    return await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: hashedPassword,
      },
    });
  } catch (error) {
    console.error(error);
    throw new Error("Error in auth service: updatePassword");
  }
};
