import { NextFunction, Request, Response } from "express";
import {
  createAd,
  getAllAds,
  getAdById,
  updateAd,
  deleteAd,
} from "../services/ad.service";

export const createAdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { name, category, description, price, adImage } = req.body;
    const user = req.user;

    if (!name || !category || !description || !price || !adImage)
      return res.status(400).json({ message: "Please fill in all fields" });

    if (!user || !user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const adData = {
      name,
      category,
      description,
      price,
      adImage,
      ownerId: user.id,
    };

    const newAd = await createAd(adData);
    res.status(201).json({ message: "Ad created successfully", data: newAd });
  } catch (error) {
    next(error);
  }
};

export const getAllAdsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const ads = await getAllAds();
    if (!ads?.length) return res.status(404).json({ message: "No ads found" });

    res.status(200).json(ads);
  } catch (error) {
    next(error);
  }
};

export const getAdByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const ad = await getAdById(id);

    if (!ad) return res.status(404).json({ message: "Ad not found" });
    if(ad.isBlocked)
      return res.status(404).json({ message: "This ad is blocked" });

    res.status(200).json(ad);
  } catch (error) {
    next(error);
  }
};

export const updateAdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const adData = req.body;
    const updatedAd = await updateAd(id, adData);

    res
      .status(200)
      .json({ message: "Ad updated successfully", data: updatedAd });
  } catch (error) {
    next(error);
  }
};

export const deleteAdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    await deleteAd(id);

    res.status(200).json({ message: "Ad deleted successfully" });
  } catch (error) {
    next(error);
  }
};
