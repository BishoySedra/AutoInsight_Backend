import { Router } from "express";
import uploadFile from "../middlewares/upload/file.js";
import * as datasetController from "../controllers/dataset.js";
import authorize from "../middlewares/authorization/authorize.js";

const router = Router();


router.post("/choose-domain", authorize, datasetController.selectDomain);
router.post("/upload", authorize, uploadFile, datasetController.storeFile);
router.post("/processing-options", authorize, datasetController.selectOptions);
router.post("/grant-access", authorize, datasetController.grantUserAccess);
router.post("/generate-insights", authorize, datasetController.generateInsights);

// endpoint to add a new dataset
// router.post("/upload", authorize, uploadFile, datasetController.upload);

// endpoint to read all datasets with pagination
router.get("/", authorize, datasetController.readAll);

router.patch("/:dataset_id", authorize, datasetController.editDatasetName);

// endpoint to get all datasets shared with the user
router.get("/shared", authorize, datasetController.readShared);

// endpoint to read a dataset by id
router.get("/:dataset_id", authorize, datasetController.readById);

// endpoint to delete a dataset by id
router.delete("/:dataset_id", authorize, datasetController.deleteDataset);

// endpoint to add permission to a user to access a dataset
router.post("/:dataset_id/share", authorize, datasetController.share);

// endpoint to delete permission of a user to access a dataset
router.delete("/:dataset_id/share", authorize, datasetController.unshare);

// endpoint to read permissions of a dataset
router.get("/:dataset_id/share", authorize, datasetController.readPermissions);


export default router;
