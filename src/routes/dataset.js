import { Router } from "express";
import uploadFile from "../middlewares/upload/file.js";
import * as datasetController from "../controllers/dataset.js";
import authorize from "../middlewares/authorization/authorize.js";
import authorizeAdmin from "../middlewares/authorization/authorizeAdmin.js";
import checkPermission from "../middlewares/access-control/access-control.js";

const router = Router();

/**
 * @swagger
 * /datasets/cleaned-datasets-count:
 *   get:
 *     summary: Get the count of cleaned datasets
 *     tags: [Datasets]
 *     responses:
 *       200:
 *         description: Successfully retrieved the count of cleaned datasets
 *         content:
 *           application/json:
 *             example:
 *               message: "Successfully retrieved cleaned datasets count"
 *               body:
 *                 count: 25
 *               status: 200
 */
router.get("/cleaned-datasets-count", authorizeAdmin, datasetController.getNumberOfDatasetsCleaned);

/**
 * @swagger
 * /datasets/generated_dashboards_no:
 *   get:
 *     summary: Get the count of generated dashboards
 *     tags: [Datasets]
 *     responses:
 *       200:
 *         description: Successfully retrieved the count of generated dashboards
 *         content:
 *           application/json:
 *             example:
 *               message: "Successfully retrieved generated dashboards count"
 *               body:
 *                 count: 15
 *               status: 200
 */
router.get("/generated_dashboards_no", authorizeAdmin, datasetController.getNumberOfGeneratedDashboards);

/**
 * @swagger
 * /datasets/domains-count:
 *   get:
 *     summary: Get the count of available domains
 *     tags: [Datasets]
 *     responses:
 *       200:
 *         description: Successfully retrieved the count of domains
 *         content:
 *           application/json:
 *             example:
 *               message: "Successfully retrieved domains count"
 *               body:
 *                 count: 8
 *               status: 200
 */
router.get("/domains-count", authorizeAdmin, datasetController.getNumberOfDomains);

/**
 * @swagger
 * /datasets/choose-domain:
 *   post:
 *     summary: Select a domain for the dataset
 *     tags: [Datasets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               domainType:
 *                 type: string
 *                 example: "ecommerce"
 *     responses:
 *       200:
 *         description: Successfully selected a domain
 *         content:
 *           application/json:
 *             example:
 *               message: "ecommerce domain selected successfully"
 *               body:
 *                 domainType: "ecommerce"
 *                 nextStep: "/upload"
 *                 sessionId: "abc123"
 *               status: 200
 */
router.post("/choose-domain", authorize, datasetController.selectDomain);

/**
 * @swagger
 * /datasets/upload:
 *   post:
 *     summary: Upload a dataset file
 *     tags: [Datasets]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Dataset file uploaded successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "File uploaded successfully"
 *               body:
 *                 fileUrl: "https://example.com/dataset.csv"
 *                 nextStep: "/processing-options"
 *               status: 200
 */
router.post("/upload", authorize, uploadFile, datasetController.storeFile);

/**
 * @swagger
 * /datasets/processing-options:
 *   post:
 *     summary: Select processing options for the dataset
 *     tags: [Datasets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               analysis_option:
 *                 type: string
 *                 enum: ["clean_only", "clean_and_generate"]
 *                 example: "clean_and_generate"
 *               downloadAfterCreating:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Successfully selected processing options
 *         content:
 *           application/json:
 *             example:
 *               message: "Processing options saved"
 *               body:
 *                 nextStep: "/grant-access"
 *               status: 200
 */
router.post("/processing-options", authorize, datasetController.selectOptions);

/**
 * @swagger
 * /datasets/grant-access:
 *   post:
 *     summary: Grant access permissions to users for the dataset
 *     tags: [Datasets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userPermissions:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: "12345"
 *                     permission:
 *                       type: string
 *                       enum: ["view", "edit", "admin"]
 *                       example: "view"
 *     responses:
 *       200:
 *         description: Successfully granted access permissions
 *         content:
 *           application/json:
 *             example:
 *               message: "Access permissions saved successfully"
 *               body:
 *                 accessGranted: true
 *                 usersCount: 2
 *                 nextStep: "/generate-insights"
 *               status: 200
 */
router.post("/grant-access", authorize, datasetController.grantUserAccess);

/**
 * @swagger
 * /datasets/generate-insights:
 *   post:
 *     summary: Generate insights for the dataset
 *     tags: [Datasets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               datasetId:
 *                 type: string
 *                 example: "67890"
 *     responses:
 *       201:
 *         description: Successfully generated insights
 *         content:
 *           application/json:
 *             example:
 *               message: "Dataset analyzed successfully"
 *               body:
 *                 datasetId: "67890"
 *                 insights: ["Insight 1", "Insight 2"]
 *               status: 201
 */
router.post("/generate-insights", authorize, datasetController.generateInsights);

/**
 * @swagger
 * /datasets:
 *   get:
 *     summary: Retrieve all datasets for the user
 *     tags: [Datasets]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of datasets to retrieve per page
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number
 *     responses:
 *       200:
 *         description: Successfully retrieved datasets
 *         content:
 *           application/json:
 *             example:
 *               message: "Datasets read successfully"
 *               body:
 *                 datasets: [{ id: "1", name: "Dataset 1" }, { id: "2", name: "Dataset 2" }]
 *               status: 200
 */
router.get("/", authorize, datasetController.readAll);

/**
 * @swagger
 * /datasets/shared:
 *   get:
 *     summary: Get all shared datasets
 *     tags: [Datasets]
 *     responses:
 *       200:
 *         description: Successfully retrieved shared datasets
 */
router.get("/shared", authorize, datasetController.readAllShared);

/**
 * @swagger
 * /datasets/{dataset_id}:
 *   patch:
 *     summary: Edit dataset name
 *     tags: [Datasets]
 *     parameters:
 *       - in: path
 *         name: dataset_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Dataset ID
 *     responses:
 *       200:
 *         description: Successfully updated dataset name
 */
router.patch("/:dataset_id", authorize, checkPermission("edit"), datasetController.editDatasetName);

/**
 * @swagger
 * /datasets/{dataset_id}:
 *   get:
 *     summary: Get dataset by ID
 *     tags: [Datasets]
 *     parameters:
 *       - in: path
 *         name: dataset_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Dataset ID
 *     responses:
 *       200:
 *         description: Successfully retrieved dataset
 *         content:
 *           application/json:
 *             example:
 *               message: "Successfully retrieved dataset"
 *               body:
 *                 id: "1"
 *                 name: "Dataset 1"
 *               status: 200
 */
router.get("/:dataset_id", authorize, checkPermission("view"), datasetController.readById);

/**
 * @swagger
 * /datasets/{dataset_id}:
 *   delete:
 *     summary: Delete a dataset by ID
 *     tags: [Datasets]
 *     parameters:
 *       - in: path
 *         name: dataset_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Dataset ID
 *     responses:
 *       200:
 *         description: Successfully deleted dataset
 */
router.delete("/:dataset_id", authorize, checkPermission('admin'), datasetController.deleteDataset);

/**
 * @swagger
 * /datasets/{dataset_id}/share:
 *   post:
 *     summary: Share a dataset with a user
 *     tags: [Datasets]
 *     parameters:
 *       - in: path
 *         name: dataset_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Dataset ID
 *     responses:
 *       200:
 *         description: Successfully shared dataset
 */
router.post("/:dataset_id/share", authorize, checkPermission('edit'), datasetController.share);

/**
 * @swagger
 * /datasets/{dataset_id}/share:
 *   delete:
 *     summary: Unshare a dataset with a user
 *     tags: [Datasets]
 *     parameters:
 *       - in: path
 *         name: dataset_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Dataset ID
 *     responses:
 *       200:
 *         description: Successfully unshared dataset
 */
router.delete("/:dataset_id/share", authorize, checkPermission('admin'), datasetController.unshare);

/**
 * @swagger
 * /datasets/{dataset_id}/share:
 *   get:
 *     summary: Get dataset sharing permissions
 *     tags: [Datasets]
 *     parameters:
 *       - in: path
 *         name: dataset_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Dataset ID
 *     responses:
 *       200:
 *         description: Successfully retrieved sharing permissions
 */
router.get("/:dataset_id/share", authorize, checkPermission('edit'), datasetController.readPermissions);

export default router;
