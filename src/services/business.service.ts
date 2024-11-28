import { Business } from "../entity";
import { PrismaService } from "./prisma.service";
const prisma = PrismaService;

//Create business
export const createBusiness = async (businessData: Business) => {
  try {
    return await prisma.business.create({
      data: businessData,
    });
  } catch (error) {
    console.error(error);
  }
};

//Get all businesss
export const getAllBusinesses = async () => {
  try {
    return await prisma.business.findMany();
  } catch (error) {
    console.error(error);
  }
};

//Get an business
export const getBusinessById = async (id: string) => {
  try {
    return await prisma.business.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error(error);
  }
};

//Update business
export const updateBusiness = async (id: string, businessData: Business) => {
  try {
    return await prisma.business.update({
      where: { id },
      data: businessData,
    });
  } catch (error) {
    console.error(error);
  }
};

//Delete business
export const deleteBusiness = async (id: string) => {
  try {
    return await prisma.business.delete({
      where: { id },
    });
  } catch (error) {
    console.error(error);
  }
};
