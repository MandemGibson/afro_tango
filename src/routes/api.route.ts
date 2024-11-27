import { Router } from "express";
import { authRouter } from "./auth.route";
import { userRouter } from "./user.route";
import { adRouter } from "./ad.route";
import { eventRouter } from "./event.route";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter)
apiRouter.use("/users", userRouter)
apiRouter.use("/ads", adRouter)
apiRouter.use("/events", eventRouter)