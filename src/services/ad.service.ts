import { Ad } from "../entity";
import { PrismaService } from "./prisma.service";
const prisma = PrismaService;

//Create ad
export const createAd = async (adData: Ad) => {
  try {
    return await prisma.ad.create({
      data: adData,
    });
  } catch (error) {
    console.error(error);
  }
};

//Get all ads
export const getAllAds = async () => {
  try {
    return await prisma.ad.findMany({
      where: { isBlocked: false },
    });
  } catch (error) {
    console.error(error);
  }
};

//Get an ad
export const getAdById = async (id: string) => {
  try {
    return await prisma.ad.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error(error);
  }
};

//Update ad
export const updateAd = async (id: string, adData: Ad) => {
  try {
    return await prisma.ad.update({
      where: { id },
      data: adData,
    });
  } catch (error) {
    console.error(error);
  }
};

//Delete ad
export const deleteAd = async (id: string) => {
  try {
    return await prisma.ad.delete({
      where: { id },
    });
  } catch (error) {
    console.error(error);
  }
};
