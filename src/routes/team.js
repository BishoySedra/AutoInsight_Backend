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
 *     security:
 *       - bearerAuth: []
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
 *               members:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["user1Id", "user2Id"]
 *               datasets:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["dataset1Id", "dataset2Id"]
 *               memberPermission:
 *                 type: string
 *                 example: "view"
 *     responses:
 *       201:
 *         description: Team created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Team created successfully"
 *               body:
 *                 id: "teamId123"
 *                 name: "Development Team"
 *                 members: ["user1Id", "user2Id"]
 *                 datasets: ["dataset1Id", "dataset2Id"]
 *                 memberPermission: "view"
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
 *                   - id: "team1Id"
 *                     name: "Development Team"
 *                     members: ["user1Id", "user2Id"]
 *                     datasets: ["dataset1Id"]
 *                     memberPermission: "view"
 *                   - id: "team2Id"
 *                     name: "Marketing Team"
 *                     members: ["user3Id"]
 *                     datasets: ["dataset2Id"]
 *                     memberPermission: "edit"
 *               status: 200
 */
// endpoint to get all teams for the current user
router.get("/", authorize, teamController.getAllTeams);

/**
 * @swagger
 * /teams/{teamId}/members:
 *   patch:
 *     summary: Update team members
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the team to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               members:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["user1Id", "user2Id"]
 *     responses:
 *       200:
 *         description: Successfully updated team members
 *         content:
 *           application/json:
 *             example:
 *               message: "Team members updated successfully"
 *               body:
 *                 id: "teamId123"
 *                 name: "Development Team"
 *                 members: ["user1Id", "user2Id"]
 *               status: 200
 */
// endpoint to add/remove/update a team member
router.patch("/:teamId/members", authorize, checkTeamPermission("admin"), teamController.updateTeamMembers);

/**
 * @swagger
 * /teams/{teamId}/datasets:
 *   patch:
 *     summary: Update datasets in a team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the team to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               datasets:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["dataset1Id", "dataset2Id"]
 *     responses:
 *       200:
 *         description: Successfully updated team datasets
 *         content:
 *           application/json:
 *             example:
 *               message: "Team datasets updated successfully"
 *               body:
 *                 id: "teamId123"
 *                 name: "Development Team"
 *                 datasets: ["dataset1Id", "dataset2Id"]
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
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the team to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               memberPermission:
 *                 type: string
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: Successfully updated team permissions
 *         content:
 *           application/json:
 *             example:
 *               message: "Team permissions updated successfully"
 *               body:
 *                 id: "teamId123"
 *                 name: "Development Team"
 *                 memberPermission: "admin"
 *               status: 200
 */
// endpoint to update team permission
router.patch("/:teamId/permission", authorize, checkTeamPermission("admin"), teamController.updateTeamPermission);

export default router;
