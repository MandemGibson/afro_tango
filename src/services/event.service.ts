import { Event } from "../entity";
import { PrismaService } from "./prisma.service";
const prisma = PrismaService;

//Create event
export const createEvent = async (eventData: Event) => {
  try {
    if (eventData.date && typeof eventData.date === "string") {
      eventData.date = new Date(eventData.date);
    }
    return await prisma.event.create({
      data: eventData,
    });
  } catch (error) {
    console.error(error);
  }
};

//Get all events
export const getAllEvents = async () => {
  try {
    return await prisma.event.findMany();
  } catch (error) {
    console.error(error);
  }
};

//Get an event
export const getEventById = async (id: string) => {
  try {
    return await prisma.event.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error(error);
  }
};

//Update event
export const updateEvent = async (id: string, eventData: Event) => {
  try {
    if (eventData.date && typeof eventData.date === "string") {
      eventData.date = new Date(eventData.date);
    }
    return await prisma.event.update({
      where: { id },
      data: eventData,
    });
  } catch (error) {
    console.error(error);
  }
};

//Delete event
export const deleteEvent = async (id: string) => {
  try {
    return await prisma.event.delete({
      where: { id },
    });
  } catch (error) {
    console.error(error);
  }
};
