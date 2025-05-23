import { Router } from "express";
import * as teamController from "../controllers/team.js";
import authorize from "../middlewares/authorization/authorize.js";
import checkTeamPermission from "../middlewares/access-control/team-access-control.js";

const router = Router();

/**
 * @swagger
 * /teams:
 *   post:
 *     summary: Create a new team
 *     tags: [Teams]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Development Team"
 *               description:
 *                 type: string
 *                 example: "Team responsible for software development"
 *     responses:
 *       201:
 *         description: Team created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Team created successfully"
 *               body:
 *                 id: "12345"
 *                 name: "Development Team"
 *                 description: "Team responsible for software development"
 *               status: 201
 */
// endpoint to create a new team
router.post("/", authorize, teamController.createTeam);

/**
 * @swagger
 * /teams:
 *   get:
 *     summary: Get all teams for the current user
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved teams
 *         content:
 *           application/json:
 *             example:
 *               message: "Successfully retrieved teams"
 *               body:
 *                 teams:
 *                   - id: "1"
 *                     name: "Development Team"
 *                   - id: "2"
 *                     name: "Marketing Team"
 *               status: 200
 */
// endpoint to get all teams for the current user
router.get("/", authorize, teamController.getAllTeams);

/**
 * @swagger
 * /teams/{teamId}/members:
 *   patch:
 *     summary: Add, remove, or update a team member
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *         description: Team ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *                 example: "add"
 *               memberId:
 *                 type: string
 *                 example: "67890"
 *     responses:
 *       200:
 *         description: Successfully updated team members
 *         content:
 *           application/json:
 *             example:
 *               message: "Team members updated successfully"
 *               body: {}
 *               status: 200
 */
// endpoint to add/remove/update a team member
router.patch("/:teamId/members", authorize, checkTeamPermission("admin"), teamController.updateTeamMembers);

/**
 * @swagger
 * /teams/{teamId}/datasets:
 *   patch:
 *     summary: Add, remove, or update datasets in a team
 *     tags: [Teams]
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *         description: Team ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *                 example: "add"
 *               datasetId:
 *                 type: string
 *                 example: "12345"
 *     responses:
 *       200:
 *         description: Successfully updated team datasets
 *         content:
 *           application/json:
 *             example:
 *               message: "Team datasets updated successfully"
 *               body: {}
 *               status: 200
 */
// endpoint to add/remove/update dataset to a team
router.patch("/:teamId/datasets", authorize, checkTeamPermission("admin"), teamController.assignDataset);

/**
 * @swagger
 * /teams/{teamId}/permission:
 *   patch:
 *     summary: Update team permissions
 *     tags: [Teams]
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *         description: Team ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               permission:
 *                 type: string
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: Successfully updated team permissions
 *         content:
 *           application/json:
 *             example:
 *               message: "Team permissions updated successfully"
 *               body: {}
 *               status: 200
 */
// endpoint to update team permission
router.patch("/:teamId/permission", authorize, checkTeamPermission("admin"), teamController.updateTeamPermission);

export default router;
