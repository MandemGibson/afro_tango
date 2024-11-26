import { NextFunction, Request, Response } from "express";

// Custom error interface to allow status codes
interface CustomError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = err.statusCode || 500; // Default to 500 if no statusCode is provided
  res.status(status).json({
    status: status,
    message: err.message || "An unexpected error occurred.",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined, // Include stack trace only in development mode
  });
};
