import { NextFunction, Request, Response } from "express";
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../services/event.service";

export const createEventHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { name, category, description, date, eventImage, location } =
      req.body;
    const user = req.user;

    if (!name || !category || !description || !date || !eventImage || !location)
      return res.status(400).json({ message: "Please fill in all fields" });

    if (!user || !user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const eventData = {
      name,
      description,
      category,
      date,
      location,
      eventImage,
      creatorId: user.id,
    };

    const newEvent = await createEvent(eventData);
    res
      .status(201)
      .json({ message: "Event created successfully", data: newEvent });
  } catch (error) {
    next(error);
  }
};

export const getAllEventsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const events = await getAllEvents();
    if (!events?.length)
      return res.status(404).json({ message: "No events found" });

    res.status(200).json(events);
  } catch (error) {
    next(error);
  }
};

export const getEventByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const event = await getEventById(id);

    if (!event) return res.status(404).json({ message: "Event not found" });

    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

export const updateEventHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    const eventData = req.body;
    const updatedEvent = await updateEvent(id, eventData);

    res
      .status(200)
      .json({ message: "Event updated successfully", data: updatedEvent });
  } catch (error) {
    next(error);
  }
};

export const deleteEventHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { id } = req.params;
    await deleteEvent(id);

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    next(error);
  }
};
