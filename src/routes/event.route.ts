import { Router } from "express";
import { protectedRoute } from "../middlewares/protectedRoute";
import {
  createEventHandler,
  deleteEventHandler,
  getEventByIdHandler,
  getAllEventsHandler,
  updateEventHandler,
} from "../controllers/event.controller";
const eventRouter = Router();

eventRouter.get("/", protectedRoute, getAllEventsHandler);
eventRouter.post("/", protectedRoute, createEventHandler);
eventRouter
  .route("/:id")
  .get(protectedRoute, getEventByIdHandler)
  .put(protectedRoute, updateEventHandler)
  .delete(protectedRoute, deleteEventHandler);

export { eventRouter };
