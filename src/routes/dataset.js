import { Router } from "express";
import uploadFile from "../middlewares/upload/file.js";
import * as datasetController from "../controllers/dataset.js";
import authorize from "../middlewares/authorization/authorize.js";

const router = Router();

// endpoint to add a new dataset
router.post("/upload", authorize, uploadFile, datasetController.upload);

export default router;
