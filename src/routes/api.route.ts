import { Router } from "express";
import { authRouter } from "./auth.route";
import { userRouter } from "./user.route";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter)
apiRouter.use("/users", userRouter)