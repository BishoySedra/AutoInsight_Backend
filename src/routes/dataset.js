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
 *         description: Successfully retrieved cleaned datasets count
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
 *         description: Successfully retrieved generated dashboards count
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
 *     summary: Get the count of domains
 *     tags: [Datasets]
 *     responses:
 *       200:
 *         description: Successfully retrieved domains count
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
 *     summary: Select a domain for a dataset
 *     tags: [Datasets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               domain:
 *                 type: string
 *                 example: "Finance"
 *     responses:
 *       200:
 *         description: Successfully selected domain
 *         content:
 *           application/json:
 *             example:
 *               message: "Successfully selected domain"
 *               body:
 *                 domain: "Finance"
 *               status: 200
 */
router.post("/choose-domain", authorize, datasetController.selectDomain);

/**
 * @swagger
 * /datasets/upload:
 *   post:
 *     summary: Upload a dataset
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
 *       201:
 *         description: Dataset uploaded successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Dataset uploaded successfully"
 *               body:
 *                 url: "https://example.com/dataset.csv"
 *               status: 201
 */
router.post("/upload", authorize, uploadFile, datasetController.storeFile);

/**
 * @swagger
 * /datasets/processing-options:
 *   post:
 *     summary: Select processing options for a dataset
 *     tags: [Datasets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Remove duplicates", "Normalize data"]
 *     responses:
 *       200:
 *         description: Successfully selected processing options
 *         content:
 *           application/json:
 *             example:
 *               message: "Successfully selected processing options"
 *               body:
 *                 options: ["Remove duplicates", "Normalize data"]
 *               status: 200
 */
router.post("/processing-options", authorize, datasetController.selectOptions);

/**
 * @swagger
 * /datasets/grant-access:
 *   post:
 *     summary: Grant access to a dataset
 *     tags: [Datasets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "12345"
 *     responses:
 *       200:
 *         description: Successfully granted access
 *         content:
 *           application/json:
 *             example:
 *               message: "Successfully granted access"
 *               body:
 *                 userId: "12345"
 *               status: 200
 */
router.post("/grant-access", authorize, datasetController.grantUserAccess);

/**
 * @swagger
 * /datasets/generate-insights:
 *   post:
 *     summary: Generate insights for a dataset
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
 *       200:
 *         description: Successfully generated insights
 *         content:
 *           application/json:
 *             example:
 *               message: "Successfully generated insights"
 *               body:
 *                 insights: ["Insight 1", "Insight 2"]
 *               status: 200
 */
router.post("/generate-insights", authorize, datasetController.generateInsights);

/**
 * @swagger
 * /datasets/clean-dataset:
 *   post:
 *     summary: Clean a dataset
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
 *         description: Successfully cleaned dataset
 *         content:
 *           application/json:
 *             example:
 *               message: "Successfully cleaned dataset"
 *               body:
 *                 url: "https://example.com/cleaned-dataset.csv"
 *               status: 200
 */
router.post("/clean-dataset", authorize, uploadFile, datasetController.cleanData);

/**
 * @swagger
 * /datasets:
 *   get:
 *     summary: Get all datasets
 *     tags: [Datasets]
 *     responses:
 *       200:
 *         description: Successfully retrieved datasets
 *         content:
 *           application/json:
 *             example:
 *               message: "Successfully retrieved datasets"
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
