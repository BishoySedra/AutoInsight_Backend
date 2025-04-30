import * as teamService from '../services/team.js';
import { createNotification } from '../services/notification.js';
import { wrapper } from "../utils/wrapper.js";
import { sendResponse } from "../utils/response.js";
import { createCustomError } from "../middlewares/errors/customError.js";
import Team from "../DB/models/team.js";

// controller to create a new team
export const createTeam = wrapper(async (req, res) => {
    const teamData = req.body;
    const owner = req.userId;

    // create new team
    const team = await teamService.createTeam(teamData, owner);
    await notificationService.createNotification(owner, `Team ${teamData.name} has been created `);
    return sendResponse(res, team, "Team created successfully", 201);
});

// controller to get all teams for the current user
export const getAllTeams = wrapper(async (req, res) => {
    const userId = req.userId;

    // get all teams for the current user
    const teams = await teamService.getAllTeams(userId);
    return sendResponse(res, teams, "Teams fetched successfully", 200);
});

// controller to update team members
export const updateTeamMembers = wrapper(async (req, res) => {
    const { teamId } = req.params;
    const { members } = req.body;

    // update team members
    const updatedTeam = await teamService.updateTeamMembers(teamId, members);
    members.forEach(member => createNotification(member, `You are a member of team ${updatedTeam.name}`));
    return sendResponse(res, updatedTeam, "Team members updated successfully", 200);
});

// controller to assign dataset to team
export const assignDataset = wrapper(async (req, res) => {
    const { teamId } = req.params;
    const { datasets } = req.body;

    // assign dataset to team
    const updatedTeam = await teamService.assignDataset(teamId, datasets);
    return sendResponse(res, updatedTeam, "Dataset assigned to team successfully", 200);
});

// controller to update team permission
export const updateTeamPermission = wrapper(async (req, res) => {
    const { teamId } = req.params;
    const { memberPermission } = req.body;

    // update team permission
    const updatedTeam = await teamService.updateTeamPermission(teamId, memberPermission);
    return sendResponse(res, updatedTeam, "Team permission updated successfully", 200);
});