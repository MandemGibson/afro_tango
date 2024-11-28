import { NextFunction, Request, Response } from "express";
import {
  createBusiness,
  getAllBusinesses,
  getBusinessById,
  updateBusiness,
  deleteBusiness,
} from "../services/business.service";

export const createBusinessHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const {
      name,
      category,
      address,
      email,
      businessImage,
      mapLink,
      whatsappNumber,
      phoneNumber,
    } = req.body;
    const user = req.user;

    if (
      !name ||
      !category ||
      !address ||
      !email ||
      !businessImage ||
      !mapLink ||
      !whatsappNumber ||
      !phoneNumber
    )
      return res.status(400).json({ message: "Please fill in all fields" });

    if (!user || !user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const businessData = {
      name,
      address,
      category,
      email,
      mapLink,
      whatsappNumber,
      phoneNumber,
      businessImage,
      ownerId: user.id,
    };

    const newBusiness = await createBusiness(businessData);
    if (!newBusiness)
      return res.status(500).json({ message: "Failed to create business" });
    res
      .status(201)
      .json({ message: "Business listed successfully", data: newBusiness });
  } catch (error) {
    next(error);
  }
};

export const getAllBusinessesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const businesses = await getAllBusinesses();
    if (!businesses?.length)
      return res.status(404).json({ message: "No businesses found" });

    res.status(200).json(businesses);
  } catch (error) {
    next(error);
  }
};

export const getBusinessByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const business = await getBusinessById(id);

    if (!business)
      return res.status(404).json({ message: "Business not found" });

    res.status(200).json(business);
  } catch (error) {
    next(error);
  }
};

export const updateBusinessHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const businessData = req.body;
    const updatedBusiness = await updateBusiness(id, businessData);

    if (!updatedBusiness)
      return res.status(404).json({ message: "Business not found" });

    res.status(200).json({
      message: "Business updated successfully",
      data: updatedBusiness,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBusinessHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const deletedBusiness = await deleteBusiness(id);

    if (!deletedBusiness)
      return res.status(404).json({ message: "Business not found" });

    res.status(200).json({ message: "Business deleted successfully" });
  } catch (error) {
    next(error);
  }
};
