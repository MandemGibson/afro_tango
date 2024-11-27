import { Router } from "express";
import { protectedRoute } from "../middlewares/protectedRoute";
import {
  deleteUserHandler,
  getAllUsersHandler,
  getUserByIdHandler,
  updateUserHandler,
} from "../controllers/user.controller";

const userRouter = Router();

userRouter.get("/", protectedRoute, getAllUsersHandler);

userRouter
  .route("/:id")
  .get(protectedRoute, getUserByIdHandler)
  .put(protectedRoute, updateUserHandler)
  .delete(protectedRoute, deleteUserHandler);

export { userRouter };