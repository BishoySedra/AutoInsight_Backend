import Team from "../../DB/models/team.js";
import { createCustomError } from "../errors/customError.js";

const checkTeamPermission = (requiredPermission) => async (req, res, next) => {
    try {
        const { teamId } = req.params;
        const userId = req.userId;

        const team = await Team.findById(teamId);

        if (!team) {
            throw new createCustomError("Team not found", 404, null);
        }

        // Owner always has full access
        if (team.owner.toString() === userId) {
            req.team = team;
            return next();
        }

        // Check if user is in members array
        const isMember = team.members.some((memberId) => memberId.toString() === userId);
        if (!isMember) {
            throw new createCustomError("Access Denied: Not a team member", 403, null);
        }

        const permissionLevels = { view: 1, edit: 2, admin: 3 };
        const userPermission = team.memberPermission || "view"; // fallback if somehow null

        if (permissionLevels[userPermission] < permissionLevels[requiredPermission]) {
            throw new createCustomError("Access Denied: Insufficient Team Permission", 403, null);
        }

        req.team = team;
        next();
    } catch (error) {
        next(error);
    }
};

export default checkTeamPermission;
