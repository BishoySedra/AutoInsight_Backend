import { Router } from "express";
import uploadFile from "../middlewares/upload/file.js";
import * as datasetController from "../controllers/dataset.js";
import authorize from "../middlewares/authorization/authorize.js";
import checkPermission from "../middlewares/access-control/access-control.js";

const router = Router();


router.post("/choose-domain", authorize, datasetController.selectDomain);
router.post("/upload", authorize, uploadFile, datasetController.storeFile);
router.post("/processing-options", authorize, datasetController.selectOptions);
router.post("/grant-access", authorize, datasetController.grantUserAccess);
router.post("/generate-insights", authorize, datasetController.generateInsights);

router.post("/clean-dataset", authorize, uploadFile, datasetController.cleanData);

// endpoint to add a new dataset
// router.post("/upload", authorize, uploadFile, datasetController.upload);

// endpoint to read all datasets with pagination
router.get("/", authorize, datasetController.readAll);

// endpoint to read all shared datasets with pagination
router.get("/shared", authorize, datasetController.readAllShared);

// # tested
router.patch("/:dataset_id", authorize, checkPermission("edit"), datasetController.editDatasetName);

// endpoint to get all datasets shared with the user
router.get("/shared", authorize, datasetController.readShared);

// endpoint to read a dataset by id # tested
router.get("/:dataset_id", authorize, checkPermission("view"), datasetController.readById);

// endpoint to delete a dataset by id // admin
router.delete("/:dataset_id", authorize, checkPermission('admin'), datasetController.deleteDataset);

// endpoint to add permission to a user to access a dataset // admin # tested
router.post("/:dataset_id/share", authorize, checkPermission('admin'), datasetController.share);

// endpoint to delete permission of a user to access a dataset // admin
router.delete("/:dataset_id/share", authorize, checkPermission('admin'), datasetController.unshare);

// endpoint to read permissions of a dataset // admin # tested
router.get("/:dataset_id/share", authorize, checkPermission('admin'), datasetController.readPermissions);


export default router;
