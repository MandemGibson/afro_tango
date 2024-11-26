import { Guardian, User } from "../entity";
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

export const signupUser = async (userData: User, guardianData: Guardian) => {
  try {
    const { email, password, name, birthdate, gender } = userData;
    const { guardianName, guardianEmail, guardianPhone } = guardianData;

    let guardian = await prisma.guardian.findUnique({
      where: {
        email: guardianEmail,
      },
    });

    if (!guardian) {
      guardian = await prisma.guardian.create({
        data: {
          name: guardianName,
          email: guardianEmail,
          phoneNumber: guardianPhone,
        },
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        birthdate: new Date(birthdate),
        gender,
        guardianId: guardian.id,
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
