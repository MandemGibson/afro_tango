import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import asyncHandler from "express-async-handler";

declare global {
  namespace Express {
    interface Request {
      images: string[];
    }
  }
}

cloudinary.config({
  cloud_name: process.env.APP_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.APP_CLOUDINARY_API_KEY,
  api_secret: process.env.APP_CLOUDINARY_API_SECRET,
});

const uploadMultiple = asyncHandler(async (req, res, next) => {
  try {
    const images = req.files;
    console.log(images);
    const imageUrls = [];

    if (Array.isArray(images))
      for (const image of images) {
        const result = await cloudinary.uploader.upload(image.path, {
          resource_type: "auto",
        });
        imageUrls.push(result.secure_url);
      }

    req.images = imageUrls;
    console.log(req.images);

    next();
  } catch (error) {
    console.error(error);
    res.status(500).send(`Internal error at: uploadMultiple.js - ${error}`);
  }
});

export { uploadMultiple };
