import Team from "../DB/models/team.js";
import dotenv from "dotenv";
import { createCustomError } from "../middlewares/errors/customError.js";
import { getUserData } from "./user.js";
import { readById } from "./dataset.js";

dotenv.config();

// service to create a new team
export const createTeam = async (teamData, owner) => {

    // destructure team data
    const { name, members, datasets, memberPermission } = teamData;

    // check if team name is provided
    if (!name) {
        throw createCustomError(`Team name is required`, 400);
    }

    // check if team name is already taken
    const teamExists = await Team.findOne({ name, owner });

    if (teamExists) {
        throw createCustomError(`Team name already taken`, 400);
    }

    // check if owner exists
    const ownerData = await getUserData(owner);

    if (!ownerData) {
        throw createCustomError(`Owner not found`, 404);
    }

    // check if members exist
    let membersData = [];
    if (members) {
        membersData = await Promise.all(members.map(async (member) => {
            const memberData = await getUserData(member);
            if (!memberData) {
                throw createCustomError(`Member not found`, 404);
            }
            return memberData._id;
        }));
    }

    // check if datasets exist
    let datasetsData = [];
    if (datasets) {
        console.log(datasets)
        datasetsData = await Promise.all(datasets.map(async (dataset) => {
            const datasetData = await readById(dataset);
            console.log("after id ",datasetData)
            if (!datasetData) {
                throw createCustomError(`Dataset not found`, 404);
            }
            return datasetData.dataset._id;
        }));
        console.log(datasetsData)
    }

    // create new team
    const team = await Team.create({
        name,
        owner,
        members: membersData,
        datasets: datasetsData,
        memberPermission: memberPermission || "view",
    });

    // push owner to members
    team.members.push(owner);

    // save team
    await team.save();

    return team;
};

// service to get all teams for the current user
export const getAllTeams = async (userId) => {
    // check if user exists
    const user = await getUserData(userId);

    if (!user) {
        throw createCustomError(`User not found`, 404);
    }

    // get all teams for the current user
    const teams = await Team.find({ $or: [{ owner: userId }, { members: userId }] }, { __v: 0, createdAt: 0, updatedAt: 0 })
        .populate("owner", "-password -__v -_id -resetPasswordToken -resetPasswordExpires")
        .populate("members", "-password -__v -_id -resetPasswordToken -resetPasswordExpires")
        .populate("datasets", "-__v _id -user_id -createdAt -updatedAt -shared_usernames -insights_urls");

    return teams;
};

// service to update team members
export const updateTeamMembers = async (teamId, members) => {
    // check if team exists
    const teamExists = await Team.findById(teamId);

    if (!teamExists) {
        throw createCustomError(`Team not found`, 404);
    }

    // check members provided
    if (!members) {
        throw createCustomError(`Members are not provided!`, 400);
    }

    // check if members exist
    let membersData = [];
    if (members) {
        membersData = await Promise.all(members.map(async (member) => {
            const memberData = await getUserData(member);
            if (!memberData) {
                throw createCustomError(`Member not found`, 404);
            }
            return memberData._id;
        }));
    }

    // update team members
    teamExists.members = membersData;

    // check if owner is in members
    if (!teamExists.members.includes(teamExists.owner)) {
        teamExists.members.push(teamExists.owner);
    }

    // save team
    await teamExists.save();

    return teamExists;
}

// service to assign dataset to team
export const assignDataset = async (teamId, datasets) => {
    // check if team exists
    const teamExists = await Team.findById(teamId);

    if (!teamExists) {
        throw createCustomError(`Team not found`, 404);
    }

    // check datasets provided
    if (!datasets) {
        throw createCustomError(`Datasets are not provided!`, 400);
    }

    // check if datasets exist
    let datasetsData = [];
    if (datasets) {
        datasetsData = await Promise.all(datasets.map(async (dataset) => {
            const datasetData = await readById(dataset);
            if (!datasetData) {
                throw createCustomError(`Dataset not found`, 404);
            }
            return datasetData.dataset._id;
        }));
    }

    console.log(datasetsData);

    // update team datasets
    teamExists.datasets = datasetsData;

    // save team
    await teamExists.save();

    return teamExists;
}

// service to update team permission
export const updateTeamPermission = async (teamId, memberPermission) => {
    // check if team exists
    const teamExists = await Team.findById(teamId);

    if (!teamExists) {
        throw createCustomError(`Team not found`, 404);
    }

    // check if member permission is provided
    if (!memberPermission) {
        throw createCustomError(`Member permission is not provided!`, 400);
    }

    // check if member permission is valid
    const validPermissions = ["view", "edit", "admin"];
    if (!validPermissions.includes(memberPermission)) {
        throw createCustomError(`Member permission is not valid!`, 400);
    }

    // update team member permission
    teamExists.memberPermission = memberPermission;

    // save team
    await teamExists.save();

    return teamExists;
}