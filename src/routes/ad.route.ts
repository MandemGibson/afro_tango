import { Router } from "express";
import { protectedRoute } from "../middlewares/protectedRoute";
import {
    createAdHandler,
  deleteAdHandler,
  getAdByIdHandler,
  getAllAdsHandler,
  updateAdHandler,
} from "../controllers/ad.controller";
const adRouter = Router();

adRouter.get("/", protectedRoute, getAllAdsHandler);
adRouter.post("/", protectedRoute, createAdHandler)
adRouter
  .route("/:id")
  .get(protectedRoute, getAdByIdHandler)
  .put(protectedRoute, updateAdHandler)
  .delete(protectedRoute, deleteAdHandler);

export { adRouter };
