import { Router } from "express";
import { authRouter } from "./auth.route";
import { userRouter } from "./user.route";
import { adRouter } from "./ad.route";
import { eventRouter } from "./event.route";
import { businessRouter } from "./business.route";
import { uploadRouter } from "./upload.route";

export const apiRouter = Router();

apiRouter.use("/auth", authRouter)
apiRouter.use("/users", userRouter)
apiRouter.use("/ads", adRouter)
apiRouter.use("/events", eventRouter)
apiRouter.use("/businesses", businessRouter)
apiRouter.use("/create", uploadRouter)