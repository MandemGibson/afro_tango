import { Router } from "express";
import { protectedRoute } from "../middlewares/protectedRoute";
import {
  createBusinessHandler,
  deleteBusinessHandler,
  getBusinessByIdHandler,
  getAllBusinessesHandler,
  updateBusinessHandler,
} from "../controllers/business.controller";
const businessRouter = Router();

businessRouter.get("/", protectedRoute, getAllBusinessesHandler);
businessRouter.post("/", protectedRoute, createBusinessHandler);
businessRouter
  .route("/:id")
  .get(protectedRoute, getBusinessByIdHandler)
  .put(protectedRoute, updateBusinessHandler)
  .delete(protectedRoute, deleteBusinessHandler);

export { businessRouter };
