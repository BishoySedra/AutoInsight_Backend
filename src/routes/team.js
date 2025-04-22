import { Router } from "express";
import * as teamController from "../controllers/team.js";
import authorize from "../middlewares/authorization/authorize.js";
import checkTeamPermission from "../middlewares/access-control/team-access-control.js";

const router = Router();

// endpoint to create a new team
router.post("/", authorize, teamController.createTeam);

// endpoint to get all teams for the current user
router.get("/", authorize, teamController.getAllTeams);

// endpoint to add/remove/update a team member
router.patch("/:teamId/members", authorize, checkTeamPermission("admin"), teamController.updateTeamMembers);

// endpoint to add/remove/update dataset to a team
router.patch("/:teamId/datasets", authorize, checkTeamPermission("admin"), teamController.assignDataset);

// endpoint to update team permission
router.patch("/:teamId/permission", authorize, checkTeamPermission("admin"), teamController.updateTeamPermission);

export default router;
