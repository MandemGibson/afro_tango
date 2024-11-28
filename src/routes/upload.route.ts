import { Router } from "express";
import { upload } from "../middlewares/multer";
import { uploadMultiple } from "../middlewares/uploadMultiple";
const uploadRouter = Router();

uploadRouter.post("/", upload.array("images"), uploadMultiple);

export { uploadRouter };
