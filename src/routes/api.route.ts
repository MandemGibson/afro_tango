import { Router } from "express";
import { authRouter } from "./auth.route";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter)