import { Router } from "express";
import {
  forgotPasswordHandler,
  getMeHandler,
  loginHandler,
  logoutHandler,
  resetPasswordHandler,
  signupHandler,
  verifyOTPHandler,
} from "../controllers/auth.controller";
import { protectedRoute } from "../middlewares/protectedRoute";

export const authRouter = Router();

//refetch logged in user onrefresh
authRouter.get("/me", protectedRoute, getMeHandler);

//regular auth flow
authRouter.post("/signup", signupHandler);
authRouter.post("/login", loginHandler);
authRouter.post("/logout", logoutHandler);

//reset forgotten password
authRouter.post("/request-otp", forgotPasswordHandler);
authRouter.post("/verify-otp", verifyOTPHandler)
authRouter.post("/reset-password", resetPasswordHandler)
