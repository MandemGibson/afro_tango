import { User } from "../entity";
import { PrismaService } from "./prisma.service";

const prisma = PrismaService;

// Define a reusable select object
const userSelect = {
  id: true,
  firstName: true,
  otherName: true,
  lastName: true,
  username: true,
  email: true,
  password: false,
  bio: true,
  phoneNumber: true,
  websiteLink: true,
  facebookLink: true,
  instagramLink: true,
  snapChatLink: true,
  whatsAppLink: true,
  profilePic: true,
  coverPic: true,
  gender: true,
  nationality: true,
  dob: true,
  createdAt: true,
  updatedAt: true,
  ads: true,
  businesses: true,
  createdEvents: true,
  communities: true,
  registeredEvents: true,
  connections: true
};

// Get all users
export const getAllUsers = async (): Promise<User[]> => {
  try {
    return await prisma.user.findMany({ select: userSelect });
  } catch (error) {
    console.error(error);
    throw new Error("Error getting all users");
  }
};

// Get a single user by id
export const getUserById = async (id: string): Promise<User | null> => {
  try {
    return await prisma.user.findUnique({ where: { id }, select: userSelect });
  } catch (error) {
    console.error(error);
    throw new Error("Error getting user by id");
  }
};

// Get a single user by email
export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    return await prisma.user.findUnique({ where: { email } });
  } catch (error) {
    console.error(error);
    throw new Error("Error getting user by email");
  }
};

// Update a user
export const updateUser = async (
  id: string,
  userData: User
): Promise<User | undefined> => {
  try {
    if (userData.dob && typeof userData.dob === "string") {
      userData.dob = new Date(userData.dob);
    }
    return await prisma.user.update({
      where: { id },
      data: userData,
      select: userSelect,
    });
  } catch (error: any) {
    console.error(error.message);
    throw new Error("Error updating user");
  }
};

// Delete a user
export const deleteUser = async (id: string): Promise<any> => {
  try {
    await prisma.user.delete({ where: { id } });
  } catch (error) {
    console.error(error);
    throw new Error("Error deleting user");
  }
};
